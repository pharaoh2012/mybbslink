#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#	 http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import re
from base import *
import logging
from model import *
import datetime
import time

class GetHandler(webapp2.RequestHandler):
	
	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False
	
	def SaveLinks(self,web,links):
		if len(links)==0:
			Sendemail(u"获取网页链接失败",u"网址："+web.url+"\nediturl= http://mybbslink.appspot.com/edit?id=%s" %(web.key().id(),))
			return
		domain=web.domain
		pid=web.key().id()
		for link in links:
			dblink=Link.all().filter('urlid = ',link["urlid"]).filter('domain = ',domain).get()
			if not dblink:
				#logging.info("save link..........")
				dblink=Link()
				dblink.title=link["title"]
				dblink.url=link["url"]
				dblink.urlid=link["urlid"]
				dblink.domain=domain
				dblink.pid=pid
				dblink.put()
	
	def get(self):
		links=[]
		try:
			id=int(self.request.get('id'))
			web=Web.get_by_id(id)
			needcheck=False
		except Exception, e:
			id=-1
			web=Web.all().order("nextgettime").get()
			needcheck = True
		if web:
			if needcheck and web.nextgettime and web.nextgettime > datetime.datetime.now():
				self.response.out.write('not need to get:%s' %(web.name,))
				logging.warning('get: not need to get:%s' %(web.name,))
				return
			web.geturlcount=web.geturlcount+1
			web.nextgettime = datetime.datetime.now() + datetime.timedelta(minutes = 5)
			web.put()
			logging.info(web.url)
			links=getLinks(web)
			#self.response.out.write(links[0]['title'])
			self.SaveLinks(web,links)
			web.nextgettime = datetime.datetime.now() + datetime.timedelta(minutes = web.interval)
			web.put()			
		else:
			logging.info("no web")
			self.response.out.write("no web")
			return
		#if self.getBoolean('auto'):
		self.response.out.write(web.url)
		self.response.out.write("\n<br />")
		self.response.out.write(len(links))
		logging.warning('get %s items from %s' %(len(links),web.name))
		return
		
#		template_values = {'links':links}
        
#		self.response.out.write(getResponse('index.html',template_values))	





app = webapp2.WSGIApplication([('.*', GetHandler)],
							  debug=True)
