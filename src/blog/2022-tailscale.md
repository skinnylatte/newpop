---
title: "Tailscale"
date: 2022-04-13T15:09:57-07:00
draft: false
description: How I use Tailscale instead of a commercial VPN
tags: 
    - technology
    - vpn
    - computers
    - networks
    - blog
permalink: /2022-04-tailscale
layout: post.njk
---
In a previous life, I had to use VPNs extensively. I was traveling all the time and often found myself needing to do online banking tasks in one country while I was in another. I also frequently visited some countries that blocked most commercial VPNs.

For that reason, I have been figuring out how to use different VPN and VPN-like services for a long time.

The latest and greatest stuff in this space, what I default to using more frequently now, is Tailscale.

Tailscale can do a great many things. [Some people have called it the holy grail of networking](https://www.thesmarthomebook.com/2021/07/24/the-holy-grail-of-networking-tailscale/). I am certainly a fan.

Today, I will focus on how I use Tailscale to replace VPN-services for me, and ignore the other cool things that Tailscale can do.

This assumes that you have existing hardware and a connection in the country you want to connect to.

The use case for this sort of thing is an endless list:

- I have a high speed connection at my home in San Francisco. I want to use my home network from abroad in order to access some banking or enterprise applications
- Commercial VPNs can be unreliable or slow

If you have a device you can always keep 'on', such as an old laptop or desktop, or Raspberry Pi, you can ignore commercial VPN services and just use what you have. Just remember to keep your device 'on' and don't let it go to sleep.

1. On an old desktop or other device that is always plugged in, and always connected to the internet, [I install Tailscale](https://tailscale.com/download/).

2. I log in using my GitHub account (though you can also use your Google account). Tailscale will authenticate you and you should see the name of that device

3. [Make the device you just set up route traffic through an exit node](https://tailscale.com/kb/1103/exit-nodes/)

4. Go to [Tailscale admin console](https://login.tailscale.com/admin/machines), pick the machine that says Exit Node, click the three dots and make sure 'Use as exit node' is enabled

5. Install Tailscale on another device. Select the exit node you just setup

6. Check your external IP address to see that you are routing traffic through your exit node at home 

In my case, I went to a cafe near my house, used their wifi, and then connected to my exit node in Tailscale. I was able to verify there that my external IP was the same as the static IP address from my home network

Now, when I travel abroad, it will be much easier for me to access the files and services that I need, as though I never left.
