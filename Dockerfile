FROM ruby:3.1-bookworm

WORKDIR /srv/jekyll

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    libffi-dev \
    libyaml-dev \
    zlib1g-dev \
    pkg-config \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock* ./

RUN gem install bundler && bundle install

EXPOSE 4000 35729
