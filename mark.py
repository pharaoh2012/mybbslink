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

class GetHandler(webapp2.RequestHandler):
	
	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False
	
	def asreader(self,ids):
		for id in ids:
			link=Link.get_by_id(int(id))		
			link.reader=True
			link.put()
		
	def settype(self,ids,type):
		for id in ids:
			link=Link.get_by_id(int(id))		
			link.color = type
			link.put()
	
	def get(self):
		ids=self.request.get('ids')
		if not ids:
			self.response.out.write('need ids')
			return
		ids=ids.split(',')

		reader=self.request.get('reader')
		if reader:
			self.asreader(ids)		
			self.response.out.write('ok')
			return 		
		
		type=self.request.get('type')
		self.settype(ids,type)
		self.response.out.write('ok')
		


app = webapp2.WSGIApplication([('.*', GetHandler)],
							  debug=True)
