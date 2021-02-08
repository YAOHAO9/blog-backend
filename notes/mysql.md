### 性能分析工具  
```  
show profile;  
mysqlsla;  
mysqldumpslow;  
explain;  
show slow log;  
show processlist;  
  
```  
  
  
### 索引建立规则  
```  
#1、首先应考虑在 where 及 order by 涉及的列上建立索引  
#2、索引并不是越多越好，索引固然可 以提高相应的 select 的效率，但同时也降低了 insert 及 update 的效率，因为 insert 或 update 时有可能会重建索引，所以怎样建索引需要慎重考虑，视具体情况而定。一个表的索引数最好不要超过6个，若太多则应考虑一些不常使用到的列上建的索引是否有 必要。  
#3、离散度大（不同的值多）的列，放在联合索引前面。查看离散度，通过统计不同的列值来实现，count越大，离散程度越高（走不走索引的问题，简单可以理解成，优化器到底是先根据索引缩小范围，再来一点随机IO，获得最终结果集还是先连续IO，边扫描边筛选，获取最终的结果集）  
#4、经常与其他表进行连接的表，在连接字段上应该建立索引  
#5、索引应该建在小字段上，对于大的文本字段甚至超长字段，不要建索引  
#6、复合索引的建立需要进行仔细分析；尽量考虑用单字段索引代替  
#7、不用外键，由程序保证约束  
#8、尽量不用UNIQUE，由程序保证约束  
#9、使用多列索引时主意顺序和查询条件保持一致，同时删除不必要的单列索引  
```  
  
  
### 查询优化  
```  
#1、应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描(可以给该字段设置默认值，从而避免is null语句)  
#2、应尽量避免在 where 子句中使用!=或<>操作符，否则引擎将放弃使用索引而进行全表扫描  
#3、应尽量避免在 where 子句中使用 or 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描  
	如：select id from t where num=10 or num=20 可以这样查询：select id from t where num=10 union all select id from t where num=20   
#4、in 和 not in 也要慎用，否则会导致全表扫描，如：select id from t where num in(1,2,3) 对于连续的数值，能用 between 就不要用 in 了：select id from t where num between 1 and 3  
#5、select id from t where name like ‘%李%’若要提高效率，可以考虑全文检索。（'李%'这种是可以命中索引的）  
#6、应尽量避免在 where 子句中对字段进行表达式操作，这将导致引擎放弃使用索引而进行全表扫描  
	如：select id from t where num/2=100应改为:select id from t where num=100*2  
#7、在使用索引字段作为条件时，如果该索引是复合索引，那么必须使用到该索引中的第一个字段作为条件时才能保证系统使用该索引，否则该索引将不会被使用，并且应尽可能的让字段顺序与索引顺序相一致。  
#8、很多时候用 exists 代替 in 是一个好的选择：select num from a where num in(select num from b)  
	如：select num from a where exists(select 1 from b where num=a.num)  
#9、并不是所有索引对查询都有效，SQL是根据表中数据来进行查询优化的，当索引列有大量数据重复时，SQL查询可能不会去利用索引，如一表中有字段sex，male、female几乎各一半，那么即使在sex上建了索引也对查询效率起不了作用  
#10、任何地方都不要使用 select * from t ，用具体的字段列表代替“*”，不要返回用不到的任何字段  
#11、使用连接（join）来代替子查询  
#12、OR改写成IN：OR的效率是n级别，IN的效率是log(n)级别，in的个数建议控制在200以内  
#13、不用函数和触发器，在应用程序实现  
#14、对于连续数值，使用BETWEEN不用IN  
```  
  
  
### 建表规则  
```  
#1、尽量使用数字型字段，若只含数值信息的字段尽量不要设计为字符型，这会降低查询和连接的性能，并会增加存储开销。这是因为引擎在处理查询和连接时会逐个比较字符串中每一个字符，而对于数字型而言只需要比较一次就够了。  
#2、尽可能的使用 varchar/nvarchar 代替 char/nchar ，因为首先变长字段存储空间小，可以节省存储空间，其次对于查询来说，在一个相对较小的字段内搜索效率显然要高些  
#3、使用可存下数据的最小的数据类型，整型 < date,time < char,varchar < blob  
#4、如果有大字段，建议分表  
#5、表字段避免null值出现，null值很难查询优化且占用额外的索引空间，推荐默认数字0代替null。  
#6、尽量使用INT而非BIGINT，如果非负则加上UNSIGNED（这样数值容量会扩大一倍），当然能使用TINYINT、SMALLINT、MEDIUM_INT更好。  
#7、使用枚举或整数代替字符串类型  
#8、尽量使用TIMESTAMP而非DATETIME  
#9、单表不要有太多字段，建议在20以内  
#10、用整型来存IP  
```  
  
  
### 分区  
```  
# 创建表和分区  
create table user(  
    id int(11),  
    money int(11) unsigned not null,  
    date datetime  
) partition by range(YEAR(date))(  
    partition p2014 values less than (2015) INDEX DIRECTORY = '/var/orders/district1' DATA DIRECTORY = '/var/orders/district1',  
    partition p2015 values less than (2016) INDEX DIRECTORY = '/var/orders/district2' DATA DIRECTORY = '/var/orders/district2',  
    partition p2016 values less than (2017) INDEX DIRECTORY = '/var/orders/district3' DATA DIRECTORY = '/var/orders/district3',  
    partition p2017 values less than maxvalue  
);  
# 新增分区  
ALTER TABLE user ADD PARTITION (partition p2018 values less than (2018) INDEX DIRECTORY = '/var/orders/district4' DATA DIRECTORY = '/var/orders/district4');  
# 删除分区  
ALTER TABLE sale_data DROP PARTITION 2017;  
```  
  
  
### 性能分析工具  
```  
#SHOW STATUS LIKE 'handler_read%' // 查看索引使用的情况  
	handler_read_key：这个值越高越好，越高表示使用索引查询到的次数。  
	handler_read_rnd_next：这个值越高，说明查询低效。  
```  
```  
# 慢查询  
#set global slow_query_log='ON'; // 将 slow_query_log 全局变量设置为“ON”状态  
#set global slow_query_log_file='/usr/local/mysql/data/slow.log'; // 设置慢查询日志存放的位置  
#set global long_query_time=1; // 查询超过1秒就记录  
#select sleep(2); // 测试  
#ls /usr/local/mysql/data/slow.log // 查看结果  
```  
  
  
### 批量更新  
```  
# 更新多条记录的一个字段  
UPDATE mytable  
    SET myfield = CASE other_field  
        WHEN 1 THEN 'value'  
        WHEN 2 THEN 'value'  
        WHEN 3 THEN 'value'  
    END  
WHERE id IN (1,2,3)  
# 更新多条记录的多个字段  
UPDATE categories  
    SET display_order = CASE id  
        WHEN 1 THEN display_order + 3  
        WHEN 2 THEN 4  
        WHEN 3 THEN 5  
    END,  
    title = CASE id  
        WHEN 1 THEN 'New Title 1'  
        WHEN 2 THEN 'New Title 2'  
        WHEN 3 THEN 'New Title 3'  
    END  
WHERE id IN (1,2,3)  
```  
  
  
### 表锁  
```  
1、innodb一定存在聚簇索引，默认以主键作为聚簇索引  
2、有几个索引，就有几棵B+树(不考虑hash索引的情形)  
3、聚簇索引的叶子节点为磁盘上的真实数据。非聚簇索引的叶子节点还是索引，指向聚簇索引B+树  
  
S锁（读锁）： select ... lock in share mode  
X锁（写锁）：select ... for update  
  
```  
  
#### 查看sql会造成什么级别的锁  
```  
# 1、执行事务  
start transaction;  
	update accounts set coin = coin + 111 where id =1;  
select sleep(10); # 根据自己的手速调整时间  
commit;  
# 2、查看表锁级别（查看有多少row被锁）  
show engine innodb status;  
  
# 3、查看正在锁表的事务（目前观察看来：只有两个事务同时执行，且后面一个事务被前面一个事务的锁影响时才会有记录）（一般使用上面两个就够了）  
select * from information_schema.INNODB_LOCKS;  
# 4、查看等待锁的事务（这个查询也是一样：只有两个事务同时执行，且后面一个事务被前面一个事务的锁影响时才会有记录）  
SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS;   
```  
  
#### 避免死锁的方法  
```  
常见的三种：  
1、如果不同程序会并发存取多个表，尽量约定以相同的顺序访问表，可以大大降低发生死锁的可能性；  
2、在同一个事务中，尽可能做到一次锁定所需要的所有资源，减少死锁产生概率；  
3、对于非常容易产生死锁的业务部分，可以尝试使用升级锁定颗粒度，通过表级锁定来减少死锁产生的概率。  
```  
#### InnoDB有三种行锁的算法：  
```  
1、Record Lock：单个行记录上的锁。  
2、Gap Lock：间隙锁，锁定一个范围，但不包括记录本身。GAP锁的目的，是为了防止同一事务的两次当前读，出现幻读的情况。  
3、Next-Key Lock：1+2，锁定一个范围，并且锁定记录本身。对于行的查询，都是采用该方法，主要目的是解决幻读的问题。  
```  
### 更新  
```  
//先插入存在则更新  
let sql = `INSERT INTO mem_roomuser(id,rid,gameid,bettype) values(${uid},${rid},${gameid},${bettype}) on DUPLICATE key update rid=${uid},gameid=${gameid},bettype=${bettype}}`  
// 多行更新时  
let sql = `INSERT INTO mem_roomuser(id,rid,gameid,bettype) values(${uid},${rid},${gameid},${bettype}) (${uid2},${rid2},${gameid2},${bettype2}) on DUPLICATE key update rid=VALUES(uid),gameid=VALUES(gameid),bettype=VALUES(bettype)`  
```  
### redis缓存  
#### 缓存穿透（redis和数据库都没有数据）  
```bash  
#解决方案1: 缓存空值并设置过期时间  
#解决方案2: Bloom Filter （通过K个散列函数将这个元素映射成一个位数组中的K个点、如果这些点有任何一个0，则被检元素一定不在；如果都是1，则被检元素很可能在）  
#   优点：节省空间、时间复杂度低   
#   缺点：准确率有误、不能删除元素  
```  
#### 缓存击穿 （热点数据过期后流量打到数据库）  
```bash  
#解决方案1: 尽量不过期  
#解决方案2：互斥锁、分布式锁  
```  
#### 缓存雪崩 （大批量数据同时过期）  
```bash  
#解决方案：打散过期时间  
```  
#### 缓存预热 （优先保证热点数据进行提前加载到缓存）  
#### 缓存降级 （只读缓存、不读数据库）  
```bash  
#缺点：数据一致性不能保证  
```  