#secretAccessKey: da3zapoupwl5gd3or72edh7wkw3k4k5jjq5vkunkfqw7otegjvpamcis6ic2tjb55fziyacmkpncvczku34jjui4mgrprvktp6dhdkq


#!/usr/bin/python
import urllib, string, time, sys, argparse,datetime, collections, hashlib, hmac,io
import requests
from urllib.parse import urlparse
from base64 import b64encode
import io

#input credentials
userId = '';
accessKeyId = '';
secretAccessKey = '';
dataKey = '';

#url
pathInfo = ''
querystring = '';
method = '';
payload = '';
contentType = '';
filePath = ''


# variables
input_url = '';
headers= {} ;
http_headers= {} ;
dapi_date = ''
fileContent = ''
files = {};

HMAC ='HMAC_1'
algorithm = hashlib.sha256



# signingBase = canonalizeHeaders(method : http_method, data : dapi_date, pathInfo : pathInfo, contentType : contentType)
def computeSignature() :
	setDate();
	signingBase = createSigningBase();
	signedBytes = sign(signingBase,secretAccessKey);
	return signedBytes;

def createAuthorizationHeader()  :
	signature = computeSignature();
	authorizationHeader = HMAC + ' ' + accessKeyId + ':' + signature.decode() + ':' + userId
	return authorizationHeader

#CREATE THE STRING TO computeSignature
def createSigningBase() :
	 global pathInfo
	 headers['method'] = method;
	 headers['date'] = dapi_date;
	 if querystring :
	 	pathInfo  = pathInfo + "?" + querystring; #add query params
	 headers['pathInfo'] = pathInfo
	 headers['payload'] = payload;
	 headers['content-type'] = contentType;
	 sorted_headers = canonalizeHeaders();
	 signingBase = ''
	 for k, v in sorted_headers.items():
	 	# ignore empty headers
	 	if v :
	 		signingBase = signingBase + v.lower()
	 signingBase = signingBase.encode('UTF-8');
	 if fileContent :
	 	signingBase = signingBase + fileContent
	 return signingBase

def hashFileContent() :
	global fileContent
	global files
	fileContent = open(filePath,'rb').read() #file content
	http_headers['Content-Disposition'] = 'form-data; filename='+filePath
	http_headers["Content-type"] = contentType
	files = {'file': open(filePath,'rb')}


#sort + lowercase
def canonalizeHeaders() :
	headers_lower = {k.lower(): v for k, v in headers.items()} #lowercase
	sorted_headers = collections.OrderedDict(sorted(headers_lower.items()))#sort
	return sorted_headers


def sign(signingBase,secretAccessKey) :
	message = bytes(signingBase)
	secret = bytes(secretAccessKey,'utf-8')
	hash = hmac.new(secret, message, algorithm)
	# to base64
	signature = b64encode(hash.digest())
	return signature


def call() :
	authorizationHeader = createAuthorizationHeader();
	url = urlparse(input_url);
	http_headers["dataKey"] = dataKey
	http_headers["x-dapi-date"] = dapi_date
	http_headers["Authorization"] = authorizationHeader
	response = requests.request(method,input_url, data=payload, files = files, headers=http_headers)
	print(response.text)

# HELPER
def setDate() :
	global dapi_date
	dapi_date = datetime.datetime.now().utcnow().isoformat()


def parseUrl () :
	global pathInfo,querystring
	parsedUrl = urlparse(input_url)
	pathInfo = parsedUrl.path;
	querystring = parsedUrl.query


if __name__ == "__main__" :
	parser = argparse.ArgumentParser()
	parser.add_argument('-u', '--userId', action="store", dest='userId')
	parser.add_argument('-a' , '--accessKeyId', action="store", dest='accessKeyId')
	parser.add_argument('-s' , '--secretAccessKey', action="store", dest='secretAccessKey')
	parser.add_argument('-d' , '--dataKey', action="store", dest='dataKey')
	parser.add_argument('-m' , '--method', action="store", dest='method',default='GET')
	parser.add_argument('-url' , '--url', action="store", dest='input_url')
	parser.add_argument('--data', action="store", dest='payload')
	parser.add_argument('-c', '--content-type', action="store", dest='contentType')
	parser.add_argument('-f', '--file', action="store", dest='filePath')

	result = parser.parse_args()
	#create object in python
	userId = result.userId
	accessKeyId = result.accessKeyId
	secretAccessKey = result.secretAccessKey
	dataKey = result.dataKey
	method = result.method
	input_url = result.input_url
	payload = result.payload
	contentType = result.contentType
	filePath = result.filePath

	if not userId :
		print ("user ID cannot be null")
		sys.exit()
	if not accessKeyId :
		print ('Access Key Id cannot be null')
		sys.exit()
	if not secretAccessKey :
		print ('Secret Access Key cannot be null')
		sys.exit()
	if not dataKey :
		print ('dataKey cannot be null')
		sys.exit()
	if not input_url :
		print ('url cannot be null')
		sys.exit()
	if filePath :
		hashFileContent()

	parseUrl()
	call()
