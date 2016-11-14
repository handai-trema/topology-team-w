## 課題1 (実機でトポロジを動かそう)

1. 実機スイッチ上に VSI x16 を作成 (各VSIは2ポート以上)
2. 全ポートを適当にケーブリング
3. Topologyを使ってトポロジを表示
4. ケーブルを抜き差ししてトポロジ画像が更新されることを確認

レポートには次のことを書いてください。

* 表示できたトポロジ画像。何パターンかあると良いです
* ケーブルを抜き差ししたときの画像
* 実機スイッチのセットアップ情報。作業中の写真なども入れるとグーです

### グループメンバー
* 木藤 崇人
* 銀杏 一輝
* 永富 賢
* 錦織 秀
* 村上 遼


## 解答

### 1. 実機スイッチ上に VSI x16 を作成 (各VSIは2ポート以上)
* VLAN定義

下記コマンドを用いて、100-1600のidのVLANを作成した。

```
vlan 100
exit

vlan 200
exit

:（略）

vlan 1600
exit
```

* インスタンス作成

下記コマンドを用いて1-16のidをもつVSIを作成した。
```
openflow openflow-id 1 virtual-switch
controller controller-name cntl1 1 <IP address of controller> port 6653
dpid 0000000000000001
openflow-vlan 100
miss-action controller
enable
exit

:（略）

openflow openflow-id 16 virtual-switch
controller controller-name cntl1 1 <IP address of controller> port 6653
dpid 0000000000000016
openflow-vlan 1600
miss-action controller
enable
exit

```


* ポートをVSIにマップ
以下のようにして各VSIに３ポートづつ割り当てた

```
interface range gigabitethernet0/1-3
switchportmode dot1q-tunnel
switchportaccess vlan 100
exit

interface range gigabitethernet0/4-6
switchportmode dot1q-tunnel
switchportaccess vlan 200
exit

:（略）

interface range gigabitethernet0/46-48
switchportmode dot1q-tunnel
switchportaccess vlan 200
exit

```


### 2. 全ポートを適当にケーブリング

適当に全ポートに対してケーブリングを行った、その様子を図１に示す。

|<img src="https://github.com/handai-trema/topology-team-w/blob/develop/picture/switch.jpg" width="420px">|  
|:----------------------------------------------------------------------------------------------------:|  
|                                   図１ ケーブルの様子		                                       |  


### 3. Topologyを使ってトポロジを表示

（適当に最初のトポロジをはっつける）

### 4. ケーブルを抜き差ししてトポロジ画像が更新されることを確認

（どこのケーブルを抜いてどう画像が変化したかの画像）

（さらに別のところにケーブルをさして画像が更新されたことを示す画像）
