# music-download

音乐下载工具

整体触发顺序：

- search 搜索音乐 发起请求
- afterSearch 搜索完成 获取歌曲列表
- choose 在歌曲列表中选择需要下载的音乐
- afterChoose 选择音乐后 触发下一个动作
- find 去查询歌曲详细信息
- afterFind 查询歌曲后拿到详细信息，取出歌曲资源链接
- download 开始下载歌曲
- downloadEnd 下载歌曲结束
