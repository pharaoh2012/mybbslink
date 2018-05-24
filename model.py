# -*- coding: utf-8 -*-
import os,logging
import json
from google.appengine.ext import db

from datetime import datetime

class DictModel(db.Model):
	def to_dict(self):
		tempdict1 = dict([(p, unicode(getattr(self, p))) for p in self.properties()])
		tempdict2 = {'key_id':unicode(self.key().id())}
		tempdict1.update(tempdict2)
		return tempdict1		


class Web(DictModel):
	name = db.StringProperty(multiline=False,default='')
	url = db.StringProperty(multiline=False,default='')
	domain = db.StringProperty(multiline=False,default='')
	encode = db.StringProperty(multiline=False,default='')
	regex = db.StringProperty(multiline=False,default='')
	urlfull = db.StringProperty(multiline=False,default='')
	mintitle = db.IntegerProperty(default=7)
	replace = db.BooleanProperty(default=False)
	type = db.StringProperty(multiline=False,default='')
	createdate=db.DateTimeProperty(auto_now_add=True)
	geturlcount=db.IntegerProperty(default=0)
	geturldate=db.DateTimeProperty(auto_now=True)
	nextgettime=db.DateTimeProperty(auto_now_add=True)
	interval = db.IntegerProperty(default=720)
	deletedate = db.IntegerProperty(default=20)
	lastdeletetime = db.DateTimeProperty(auto_now_add=True)

class Link(DictModel):
	title = db.StringProperty(multiline=False,default='')
	url = db.StringProperty(multiline=False,default='')
	urlid = db.StringProperty(multiline=False,default='')
	domain = db.StringProperty(multiline=False,default='')
	color = db.StringProperty(multiline=False,default='')
	click = db.IntegerProperty(default=0)
	reader = db.BooleanProperty(default=False)
	createdate=db.DateTimeProperty(auto_now=False,auto_now_add=True)
	pid=db.IntegerProperty(default=0)


