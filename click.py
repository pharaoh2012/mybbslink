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
		id=self.request.get('id')
		if not id:
			self.response.out.write('need id')
			return
		id=int(id)
		link=Link.get_by_id(id)
		if link:
			link.click=1
			link.put()

		url = self.request.get('url')
		self.response.out.write('''
<html>
<head>
<meta http-equiv="Content-Language" content="zh-CN">
<meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">
<meta http-equiv="refresh" content="0;url=%s">
<title></title>
<script>
window.location = "%s"
</script>
</head>
<body>
goto:%s

</body>
</html>



		''' %(url,url,url))
		#self.redirect(urldecode(url))


app = webapp2.WSGIApplication([('.*', GetHandler)],
							  debug=True)
