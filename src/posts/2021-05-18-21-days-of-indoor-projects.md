---
title: 21 Days of Indoor Projects
date: 2021-05-18T08:54:07.211Z
description: I returned to Singapore for some essential travel in the midst of a
  new COVID-19 surge. The hotel quarantine, initially set at 14 days, became 21
  days. We were in a fancy hotel and I got a lot of time to work on side
  projects. From cooking to server work and learning, I am doing it all.
tags:
  - pandemic
  - projects
  - self-hosted
  - technology
  - cooking
  - data
  - google
  - blog
layout: post.njk
---
Talk about great timing. Three days into our 14 day quarantine in Singapore, that got [extended to 21](https://www.moh.gov.sg/news-highlights/details/updates-on-local-situation-border-measures-and-shift-to-heightened-alert-to-minimise-transmission_4May2021). I found plenty of things to do.

## Cooking in a small space

* I have some experience cooking in tiny spaces with limited equipment and ingredients, from camping and travel adventures
* Food is provided during this quarantine period, but we requested that the hotel change all of our catered meals to 'salads only' since we expected lots of food delivery from friends and family
* We got takeout the rest of the time, and very occasionally 'cooked' with the rice cooker and 1.0L electric travel multi-pot

Most often, we made soft-boiled eggs and I've developed a fairly robust recipe for it. I used to make it at home on the stove, but found that with some adjustments it worked out well in the electric multi-pot as well.

### How to make soft-boiled eggs in a hotel

You'll need a kettle, and a vessel that holds heat well that has a cover. Or just a travel-sized multi-pot.

1. Boil water in multi-pot 
2. Turn off the heat when it is boiling vigorously (bubbles are rolling on the surface)
3. Add 4 large room temperature eggs into the multi-pot. Make sure the eggs are completely submerged in the hot water. Cover.
4. Set a timer for 8 minutes, get ready to have more boiled water (from the kettle) by the end of 8 minutes
5. At 8 minutes: add fresh boiling water to the multi-pot 
6. Set a timer for 4 minutes
7. After 12-13 minutes in total, take out all the eggs and put them in a bowl. Cover with tap water
8. Crack each one. If they are still too runny, put the rest back in the multi-pot for an additional minute or so

You're basically trying to keep the water temperature at around 165F / 75C that whole time. This takes a bit of trial and error. It really depends on the size of the eggs. And your pot!

## Various computer projects

### High speed media server

Even though I already have a home-based Usenet media server, I was unhappy with the i3 CPU and slow Internet speeds from its data center. I decided to switch my entire setup, prioritizing uplink speeds. I picked a data center that was promising 20Gbit/s speeds. I moved all of my services over to it within the afternoon and was happy with the performance. I'm a fan of the [-arrs](https://wiki.servarr.com/Main_Page) services for automation and organization. 

### Chromecast in hotel networks

Chromecast is a nifty little gadget but it has notable issues in networks you don't control. Like in hotel rooms. I was unable to set up the Chromecast on the hotel TV because it can't complete setup. There is a port forwarding issue. 

I managed to get around it by using my laptop as a wifi point, but that was somewhat unwieldly. In the process, I learned that tools like [Connectify](https://connectify.me) work for this precise purpose. Not having my Win10 laptop on this trip, I used Mac OS X's built-in Internet sharing feature. My hotel room has a weird setup where the TV needs to have the network cabled plugged in to even boot up, and turns off after some time if the network cable isn't there. So in my workaround, I was able to get Chromecast to work but the TV would keep shutting down.

It looks like the company behind [Connectify](https://connectify.me) also has a suite of related services like [Speedify](https://speedify.com) that would have served me well back in my road-warrior days. Those days are long gone, but I am interested in any and all technology that is travel-adjacent.

Next time I spend extended amounts of time in hotel rooms, I will probably bring my Roku stick instead. It appears Rokus don't have the same setup problems because they create their own temporary networks during the setup process.

Eventually, we went back to basics: a laptop connected to the TV using a HDMI cable. It's not as convenient as other media consumption methods we're used to, but at least it works.

And with the high speed media server setup, we were able to watch things at significantly higher quality and speeds.

### Data liberation

Towards the end of my 21 day quarantine period, I started a data liberation project to completely wean myself off Google. I don't think I'll be done before I leave; it's a huge endeavor. 

I started by using *[rclone](https://rclone.org)* to mount all of the Google Drives that I have access to. Then I setup a separate server on Hetzner, which will be for my personal cloud only. I selected Hetzner because of the variety of hardware available, friendly price point, and the ability to quickly attach storage through storage box add-ons. Most [/r/SelfHosted](https://reddit.com/r/selfhosted) and [/r/HomeLab](https://reddit.com/r/homelab) projects describe DIY projects using hardware that you put together. Having just built a gaming PC at the start of the global chip shortage of 2021, I do not have the desire to acquire any more hardware at this point. Leasing servers is the way to go for me. 

My main priority is to move all my files from legacy clouds (mainly, the several G-Suite drives I still pay for because I have been procrastinating at moving my data).

Using rclone, I've managed to send all of the data from different drives into my server, where I then dedupe files using [rmlint](https://rmlint.readthedocs.io/en/latest/index.html). 

I now plan to setup [seafile](https://www.seafile.com) and use that as my personal cloud, accessing these files on *files.mydomain.com* using the built-in reverse proxy features from the [swag Docker container](https://docs.linuxserver.io/general/swag#ombi-subdomain-reverse-proxy-example).

### Photo liberation

I also have multiple copies of photos from different Google Photos (different accounts), and iCloud (several accounts as well). I am doing the same thing as what I did for my data: pull out all the photos into one location (my server), dedupe, and then make them available through *photos.mydomain.com* using either [PhotoPrism](https://photoprism.app) or [PhotoStructure](https://photostructure.com).

## On privacy

While my data liberation projects are definitely privacy-driven, I have simply become increasingly unhappy with certain consumer products, even the ones I pay for. Drive is extremely slow once you've got terabytes of data. Transfer speeds are abysmal. As my thoughts on technology and privacy change, I have also begun to take the steps to remove Google from most aspects of my online life. Search, for me, was replaced long ago by [DuckDuckGo](https://duckduckgo.com). Email is now [Fastmail](https://fastmail.com), which I am very happy with. At this point, it is important to me to be in control of my data. I also like the idea of being able to directly support the developers who work on the tools listed above, through sponsorship or subscription. I've noticed that my views are not fringe, and many people are likewise interested in taking such steps. Sadly, it won't be an option for everyone because of the barriers involved. (For those, perhaps a solution like [Helm](https://thehelm.com) might be the way to go)

When I'm out and about in my daily life I only have an hour or two of free time a day, more on the weekends, to work on things like these. Today is day 18 of my isolated quarantine before I'm let out into the general public. I have completed most of the above projects (though photos work is still ongoing..). I will share more specifics about the server work when I can!
