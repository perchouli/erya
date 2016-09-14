Erya
====

[Erya](https://github.com/perchouli/erya)是基于[SemanticUI](http://semantic-ui.com/)开发的内容发布系统，主要用来搭建BBS。


系统的后端是简单的发布主题/回复/评论的功能，目前是基于Django(Python)的。使用Python3 + Django的架构，Python2.7测试通过。

前端使用SemanticUI，支持自适应，编辑器使用[Quilljs](http://quilljs.com/)，同样也是支持自适应的：

因为是面向国内中文用户，所以没有Google的JS/字体API等容易被墙掉的特性。


## 安装

下载[zip包](https://github.com/perchouli/erya/archive/master.zip)解压或是直接clone，用pip3安装Django。建议使用Python3运行。

    git clone https://github.com/perchouli/erya.git
    cd erya
    pip3 install -r requirements.txt

执行migration相关命令，添加管理账号。**如果使用默认的sqlite可以跳过这一步**，默认的管理账号/密码是： **root/root**

    python3 manage.py migrate
    python3 manage.py createsuperuser

进入[管理后台(/admin)](http://bbs.dmyz.org/admin/)，添加分类，分类icon请参看：　[http://semantic-ui.com/elements/icon.html](http://semantic-ui.com/elements/icon.html)

回到首页，可以开始使用了。

*   演示地址： [http://bbs.dmyz.org](http://bbs.dmyz.org)
*   Github： [https://github.com/perchouli/erya](https://github.com/perchouli/erya)
