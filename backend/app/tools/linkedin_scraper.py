from selenium import webdriver
from linkedin_scraper import Person, actions

class LinkedInScraper:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.driver = webdriver.Chrome()  # keep driver alive for session

    def scrape_profile(self, profile_url):
        try:
            actions.login(self.driver, email=self.username, password=self.password)
            person = Person(profile_url, driver=self.driver)
            return {
                'name': person.name,
                'job_title': person.job_title,
                'company': person.company,
                'location': person.location,
                'about': person.about,
                'experiences': person.experiences,
                'education': person.educations,
                'interests': person.interests,
            }
        except Exception as e:
            print(f"An error occurred while scraping the profile: {e}")
            return {}

    def close(self):
        self.driver.quit()


if __name__ == "__main__":
    from linkedin_scraper import Person, actions
    from selenium import webdriver
    driver = webdriver.Chrome()

    email = "developer.jaisoni@gmail.com"
    password =  "J@iu2003"
    actions.login(driver, email, password) #    l
    person = Person("https://www.linkedin.com/in/jai-soni-879764257/", driver=driver)
    print(person)
