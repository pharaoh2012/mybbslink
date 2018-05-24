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
import json



class MainHandler(webapp2.RequestHandler):
	def getBoolean(self,name):
		if(self.request.get(name)):
			return True
		return False

	def get(self):
		if not self.request.get('id'):
			self.response.out.write('need id')
			return
		id=int(self.request.get('id'))
		web = Web.get_by_id(id)
		web.delete()
		links=Link.all().filter('pid =',id).fetch(1000)
		for link in links:
			link.delete()
		
		self.response.out.write('ok')
		return


app = webapp2.WSGIApplication([('.*', MainHandler)],
                              debug=True)
