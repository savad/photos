
# Photos listing django app

## Project structure

- `photos` contain source for project Photos
- `photos/photos/settings.py` contain all settings for project Photos

## Installation

- Create virtualenv (Python3+)
- Install all the dependencies
- Setup database

## Run develop environment

`docker-compose run web Copilot/manage.py migrate`
`docker-compose run web Copilot/manage.py collectstatic`
`docker-compose run web Copilot/manage.py runserver`

