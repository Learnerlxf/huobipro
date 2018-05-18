# -*- coding: utf-8 -*-
# @Time    : 2018/5/17 14:59
# @Author  : 柳晓飞
# @File    : Test.py

import json

f = open('./data/market.htusdt.trade.detail','r')#以读方式打开文件
result = list()
for line in f.readlines():                          #依次读取每行
    line = line.strip()                             #去掉每行头尾空白
    if not len(line) or line.startswith('#'):       #判断是否是空行或注释行
        continue                                    #是的话，跳过不处理
    result.append(line)                             #保存
print result

text = json.loads(result[0])
print text
print text['ts']

allTrade = []
for i in range(len(result)):
    trade = json.loads(result[i])
    for j in range(len(trade['tick']['data'])):
        oneTrade = []
        d = trade['tick']['data'][j]
        oneTrade.append(d['id'])
        oneTrade.append(d['price'])
        oneTrade.append(d['amount'])
        oneTrade.append(d['direction'])
        oneTrade.append(d['ts'])
        allTrade.append(oneTrade)

import numpy as np
import pandas as pd
tradeDF = pd.DataFrame(allTrade)
tradeDF.columns = ['id','price','amount','direction','ts']
print tradeDF.head(20)


tradeDF['minute'] = tradeDF.apply(lambda x: x['ts']/60000, axis=1)
print tradeDF


def norepeatNum(group):#不重复的个数
    return len(set(list(group)))

dictMaping = {
    'id':[norepeatNum],
    'price':['max','min','mean','median','std'],
    'amount':['max','min','mean','median','std','count']
}
newTradeDF = tradeDF.groupby(['minute','direction']).agg(dictMaping)
print newTradeDF.index#apply(lambda x : 0 if str(x)=='buy' else 1)
#print newTradeDF.describe



newTradeDF['direction'] = range(newTradeDF.shape[0])
newTradeDF['direction'] = newTradeDF['direction'].map(lambda x : 0 if newTradeDF.index[x][1]=='buy' else 1)
newTradeDF['minute']= range(newTradeDF.shape[0])
newTradeDF['minute'] = newTradeDF['minute'].map(lambda x : newTradeDF.index[x][0])
#newTradeDF.set_index('minute', inplace=True)
print newTradeDF


# for indexs in newTradeDF.index:
#     print indexs

print newTradeDF.loc[newTradeDF.index[0][0]][]