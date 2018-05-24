# -*- coding: utf-8 -*-

import re
import urllib2
import jinja2
import os
import urllib
import logging
from google.appengine.api import mail
from google.appengine.api import urlfetch

jinja_environment = jinja2.Environment(autoescape=True,loader=jinja2.FileSystemLoader(os.path.dirname(__file__)+'/template'))

def getWebSource(url,encode):
#	result =  urllib2.urlopen(url)
#	#htmlSource=result.read().decode("gb2312")
#	htmlSource=result.read().decode(encode)
#	result.close()
#	return htmlSource
	result = urlfetch.fetch(url,deadline=60)
	if result.status_code == 200:
		htmlSource=result.content.decode(encode)
		return htmlSource

	return ""

def Sendemail(subject,msg):
	mail.send_mail(sender="bbslink Support <pharaoh168@gmail.com>",
	              to="rm <13638371023@139.com>",
	              subject=subject,
	              body=msg)

def getLinks(web):
	htmlSource=getWebSource(web.url,web.encode)
	if web.replace:
		htmlSource=htmlSource.replace("\n"," ").replace("\r"," ").replace("<a","\n<a")
	reg = re.compile(web.regex)
	regtitle=re.compile(r'<.+?>')
	iterator = reg.finditer(htmlSource)
	links=[]
	for match in iterator:
		urlid=match.group(1)
		urltitle = regtitle.sub('',match.group(2))
		if len(urltitle) >= web.mintitle:
			urltitle=web.type + urltitle
			url=web.urlfull % (urlid,)
			link={'title':urltitle,'url':url,'urlid':urlid}
			links.append(link)

	return links

def getResponse(template_filename,template_values):
	template = jinja_environment.get_template(template_filename)
	return template.render(template_values)


def urldecode(value):
	return  urllib.unquote(urllib.unquote(value)).decode('utf8')

def urlencode(value):
	return urllib.quote(value.encode('utf8'))

