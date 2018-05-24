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

class MainHandler(webapp2.RequestHandler):
	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False

	def getInt(self,name,d):
		try:
			return int(self.request.get(name))
		except Exception, e:
			return d

	
	def SaveWeb(self,web,id):
		if id==-1:
			web.put()
			return web.key().id()
		webNew=Web.get_by_id(id)
		webNew.name=web.name
		webNew.url=web.url
		webNew.domain=web.domain
		webNew.encode=web.encode
		webNew.regex=web.regex
		webNew.urlfull=web.urlfull
		webNew.replace=web.replace
		webNew.type=web.type
#		webNew.nextgettime = datetime.datetime.now() + datetime.timedelta(minutes = webNew.interval)
		webNew.nextgettime = datetime.datetime.now()
		webNew.interval = web.interval
		webNew.deletedate = web.deletedate
		webNew.put()
		return webNew.key().id()

	
	def post(self):
		web = Web()
		web.name = self.request.get('name')
		web.url = self.request.get('url')
		web.domain = self.request.get('domain')
		web.encode = self.request.get('encode')
		web.regex = self.request.get('regex')
		web.urlfull = self.request.get('urlfull')
		web.replace = self.getBoolean('replace')
		web.mintitle = self.getInt("mintitle",7)
		web.type = self.request.get('type')
		web.deletedate = self.getInt('deletedate',20)
		web.interval = self.getInt('interval',720)
		
		id=int(self.request.get('id'))
		
		option = self.request.get('option')

		links=None
		error=None
		
		if(option=='test'):
			#links=getLinks(url,encode,regex,urlfull,type,replace)
			try:
				links=getLinks(web)
#				logging.info(links)
				
			except Exception, e:
				logging.error(e)
				error=e.message
		elif(option=='add'):
			id=self.SaveWeb(web,-1)
			error=u"新增成功"
			self.redirect("/edit?id=%d&msg=%s" %(id,urlencode(u'新增成功')) )
		else:
			id=self.SaveWeb(web,id)
			error=u"保存成功"
		
		template_values = {
			'web':web,
			'opt':option,
			'links':links,
			'error':error,
			'id':id
		}
		self.response.out.write(getResponse('edit.html',template_values))
		
		
	
	def get(self):
		try:
			id=int(self.request.get('id'))
		except Exception, e:
			id=-1
			web=Web()
		if id>=0:
			web=Web.get_by_id(id)
		template_values = {
			'web':web,
			'id':id,
			'error':self.request.get('msg')
		}
		self.response.out.write(getResponse('edit.html',template_values))



app = webapp2.WSGIApplication([('.*', MainHandler)],
							  debug=True)
