#!/usr/bin/env python
# -*- coding: utf-8 -*- 
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
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



class MainHandler(webapp2.RequestHandler):

	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False
		
	def get(self):
		links=[]
		try:
			id=int(self.request.get('id'))
			web=Web.get_by_id(id)
		except Exception, e:
			id=-1
			web=Web.all().order("lastdeletetime").get()
		if web:
			web.lastdeletetime = datetime.datetime.now()
			web.put()
			id=web.key().id()
			deletetime=datetime.datetime.now() - datetime.timedelta(days = web.deletedate)  
			links = Link.all().filter("pid =",id).filter('color =',"").filter('createdate <',deletetime).fetch(1000)
			dcount=0
			for link in links:
				link.delete()
				dcount+=1
			msg = "delete %s item from %s" %(dcount,web.url)
			logging.warning(msg)
			self.response.out.write(msg)


app = webapp2.WSGIApplication([('.*', MainHandler)],
                              debug=True)
