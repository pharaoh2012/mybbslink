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
import json
import re
from base import *
import logging
from model import *



class MainHandler(webapp2.RequestHandler):
	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False

	def get(self):
		pid=self.request.get("pid")
		links=Link.all()
		
		if pid:
			pid=int(pid)
			links = links.filter("pid = ",pid)

		color=self.request.get("color")
		if color:
			links=links.filter('color =',color)
			
		reader=self.request.get('reader')
		if reader:
			reader = reader == 'True'
			links=links.filter('reader =',reader)
		click = self.request.get('click')
		if click:
			click=int(click)
			links=links.filter('click =',click)
		
		links=links.order("-createdate")
		count=links.count()
		page=int(self.request.get('page'))-1
		rows=int(self.request.get('rows'))
		links=links.fetch(rows,offset=page*rows)	
			
		
#		links=Link()
		self.response.headers.add_header('Access-Control-Allow-Origin', '*')
		self.response.out.write(json.dumps({'records':count,'page':(page+1),'total':int((count+rows-1)/rows),'rows': [p.to_dict() for p in links]}));
		return	



app = webapp2.WSGIApplication([('.*', MainHandler)],
                              debug=True)
