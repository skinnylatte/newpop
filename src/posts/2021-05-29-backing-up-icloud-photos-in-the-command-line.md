---
title: Backing up iCloud Photos in the command line
date: 2021-05-29T11:24:28.100Z
description: There comes a time when you might want to leave the Apple walled
  garden. Or you just want redundant backups. As part of your photo backup
  strategy, consider running a cron job to regularly backup your iCloud photos
  using this cli tool.
tags:
  - self-hosted
  - icloud
  - photos
  - servers
  - tech
  - blog
layout: post.njk
---
I have been on a roll of late with my data liberation project.

The last piece in my photo liberation project was to figure out a way to take out all of the data from iCloud. Having been in the Apple walled garden for more than a decade and a half now, I have.. a lot of stuff in there.

Apple's official documentation simply says "log in to icloud.com, select the photos you want and download as a zip". What if you've got tens of thousands, or hundreds of photos like me?

Enter [iCloud Photos Downloader](https://github.com/icloud-photos-downloader/icloud_photos_downloader), a Python utility that sucks out all of your iCloud photos into wherever you're running it.

In my case, I've [already got a Linux server going for my photos](https://popagandhi.com/posts/how-i-run-photoprism-with-docker-compose-and-reverse-proxy/) so that's where I wanted it. The eventual goal is to put all of the photos into PhotoPrism there, as I like its tagging and deduping functionality. The goal is for all of my photos to eventually live on photos.mydomain.com, which is where all photos are going to.. eventually. Right now, I've [only got my Google Photos](https://popagandhi.com/posts/21-days-of-indoor-projects/) in there. Time to get my iCloud photos in there as well.

### Install iCloud Photos Downloader in your server or other computer

In my case, I just did a `git clone` of [this repo] into my Linux server. Once downloaded, i `cd`-ed into it and ran the following command:

```
$ pip install icloudpd
$ pip install -r requirements.txt
```

As with any other pip package, there can be errors because of your Python environment. I ran into a problem with having too many Pythons, and I could not run the `./icloudpd.py` script, which threw a Python module error.

To fix this, I opened `icloudpd.py` in a text editor and I edited the first line from: `#!/usr/bin/env python` to `#!/usr/bin/env python3`. This tool needs Python 3.6+ to run.

### Starting the download process

On my Linux server, I created a directory for my photos called `icloudphotos`. 

I then ran the command:

```
icloudpd --directory ~/icloudphotos \
--username myemail@domain.com \
--password password
```

The tool will prompt you to login and authenticate to iCloud.

Note: if you have 2FA enabled, you will most likely have to re-authenticate every 90 days or so.

I got tens of thousands of photos as expected. The tool shows you a nice little progress bar with basic information. It ran for several hours (around 5 or 6?) but it really depends on your connection speeds. You can turn off video downloads by using the `--skip-videos` option. You can also have it email you when it's done by using the various smtp options, but I did not want to bother with that.

### Running icloudpd as a cron script

The next step in my workflow will be to run this as a cron script. It looks [straightforward enough](https://github.com/icloud-photos-downloader/icloud_photos_downloader#cron-task).


### Final thoughts

I also have [Syncthing](https://syncthing.net) set up and I am evaluating which workflow I prefer. I might want to continue keeping a copy of all photos on both iCloud and on PhotoPrism for redundancy. 

In any case, I'm glad to have found a non-GUI way to access my iCloud photos. This will make any projects in this category much easier from now on.
