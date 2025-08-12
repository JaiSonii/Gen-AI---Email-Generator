import time
import requests
from bs4 import BeautifulSoup
from bs4.element import NavigableString
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
# Import ChromeOptions to set headless mode
from selenium.webdriver.chrome.options import Options

class Scraper:
    def __init__(self) -> None:
        pass

    def scrape(self, url: str) -> str | None:
        """
        Attempts to scrape using the fast method first, then falls back to Selenium.
        """
        print("--- Attempting fast scrape with 'requests' ---")
        scrape_result = self._scrape_with_request(url)
        
        if not scrape_result or not scrape_result.strip():
            print("\n--- 'requests' failed or returned empty. Falling back to Headless Selenium ---")
            scrape_result = self._scrape_with_selenium(url)
            
        return scrape_result
    
    def _scrape_with_request(self, url : str) -> str | None:
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            res = requests.get(url=url, headers=headers, timeout=10)
            res.raise_for_status()
            return Scraper._soup_and_extract(res.text)
        except Exception as e:
            print(f"Error while scraping with requests: {e}")
            return None
          
    def _scrape_with_selenium(self, url : str) -> str | None:
        """
        Uses headless Selenium with a generic waiting strategy.
        """
        # Configure headless options ---
        chrome_options = Options()
        chrome_options.add_argument("--headless=new") # Runs Chrome without a UI
        chrome_options.add_argument("--window-size=1920,1080") # Optional: Specify window size

        # Initialize the driver with the new options
        driver = webdriver.Chrome(options=chrome_options)

        html_content = None
        try:
            driver.get(url)
            print("Waiting for page to load in headless mode...")
            WebDriverWait(driver, 20).until(
                lambda d: d.execute_script("return document.readyState") == 'complete'
            )
            time.sleep(2)
            
            print("Content loaded successfully.")
            html_content = driver.page_source

        except TimeoutException:
            print("Timed out waiting for page to load.")
            html_content = driver.page_source
        except Exception as e:
            print(f"An error occurred during Selenium scraping: {e}")
        finally:
            driver.quit()
        
        if html_content:
            return Scraper._soup_and_extract(html_content)
        return None

    @staticmethod
    def _soup_and_extract(html_content: str | None) -> str | None:
        if not html_content:
            return None
            
        soup = BeautifulSoup(html_content, 'html.parser')
        body_tag = soup.find('body')

        if body_tag:
            full_text = Scraper.extract_text_recursively(body_tag)
            final_text = ' '.join(full_text.split())
            return final_text
        
        print("Warning: No <body> tag found in the HTML content.")
        return None

    @staticmethod
    def extract_text_recursively(element):
        if isinstance(element, NavigableString):
            text = element.strip()
            return text + ' ' if text else ''
        if element.name in ['script', 'style', 'header', 'footer', 'nav']:
            return ''
        text_content = ''
        for child in element.children:
            text_content += Scraper.extract_text_recursively(child)
        return text_content


if __name__ == '__main__':
    url = "https://www.linkedin.com/jobs/view/4278200847/?alternateChannel=search&eBP=CwEAAAGYgq8JD6GsDDh7vXI3HzbNam1QyF-JEI-4ECD26N8pGD13VEzd1lz1gAZrzQZxdWs9NSDOIM6RFD1GkpPK47m9biT-pHFUbvX78EsL3-E3XMzSI81b7sKvn8bZ0-lVtNYQm4O_kacLZcK61gCynLvYxfiBDeJbQr0UoGucL_bTNFe0gfj4WPJmx5GyMJmTfyHmBqggexEHDENTUgHvbeqF7nFJFH6nosheFSyesDYdHmf2OyOQUt9UnlV3oayCqCeWAN_qewQvgh3yIKLpgbalRI8yYghURu_07SZ8j2ddcAOjUFlvIfyILFErC-0rvwAXRId54WkVFnGg17dGJprmoQyvzFkIYsEKM36QKT_SBZBgK1xAQKd3ew0NUTLxqNBpltz4zaTL1MRHWfnZuAe1EnY9tDACUpfNZttIz_5CZ1PPlxDBBI8x45T7crPGG7AHaxhflTiW5dLSrY4UnQQENohy3SshXW1iWw&refId=FJ1FlVuOiHi5vc1YAXoyjQ%3D%3D&trackingId=OrgjObJiq9sYZTLich8Ogw%3D%3D&lipi=urn%3Ali%3Apage%3Ad_flagship3_jobs_discovery_jymbii%3By%2FeEXZjZR%2BWZKtcQ%2Bnia4w%3D%3D"
    scraper = Scraper()
    data = scraper.scrape(url)
    print("\n--- FINAL SCRAPED DATA ---")
    print(data)