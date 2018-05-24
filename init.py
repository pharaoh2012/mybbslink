# -*- coding: utf-8 -*- 
#
import webapp2
import re
import urllib2
from model import *
import datetime

def getWebSource(url,encode):
	result =  urllib2.urlopen(url)
	htmlSource=result.read().decode(encode)
	result.close()
	return htmlSource

class MainHandler(webapp2.RequestHandler):
	def get(self):
		webs = Web().all().fetch(1000)
		for web in webs:
			web.nextgettime=datetime.datetime.now()
			web.interval = web.interval
			web.deletedate = web.deletedate
			web.lastdeletetime=datetime.datetime.now()
			web.put()
		

		self.response.out.write('end')

app = webapp2.WSGIApplication([('.*', MainHandler)],
                              debug=True)
