import { Button, Divider, Pagination, Result } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
    Link, LoaderFunction, useLoaderData, useLocation, useNavigate, useOutletContext
} from 'remix';
import TagCate from '~/components/TagCate/TagCate';
import { PostListItem } from '~/export.types';
import { getDiscussCount, parseUrl, queryToUrl, translateMd } from '~/utils';

import { api_get_posts } from './api/posts';




export const loader: LoaderFunction = async ({ request }) => {
  const results = await api_get_posts();

  // data.data.forEach((item) => {
  //   console.log(item);
    
  //   item.content = translateMd(item.content.slice(0, 500));
  // });
  
  return results;
};

interface LoaderData {
  // data: Page<PostListItem>;
  data: any
}

export default function IndexPage() {
  const results = useLoaderData<LoaderData>();
  const context = useOutletContext<GlobalContext>();
  const naviagate = useNavigate();
  const [viewWidth, setViewWidth] = useState(1440);
  // result

  // const handlePageChange = (current: number, pageSize: number) => {
  //   naviagate(queryToUrl({ ...query, current, pageSize }));
  // };

  useEffect(() => {
    setViewWidth(document.documentElement.clientWidth);
  }, []);

  return (
    <div className='flex ' style={{ height: 'calc(100vh - 64px - 40px)' }}>
      { results.data.length === 0 ? (
        <div className='flex justify-center flex-1'>
          <Result
            status='404'
            subTitle={
              <>
                {/* 对不起，未找到含有 <span className='text-red font-bold'>{query.k}</span> 关键词的文章！ */}
              </>
            }
            extra={
              <Button type='primary' onClick={() => naviagate('/')}>
                返回主页
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className='w-full xl:pr-292px'>
            {results.data.map((item: any) => {
              return (
                <li
                  key={item.slug}
                  className='border-1 border-#ebedf0 px-24px py-16px mb-10px transition hover:bg-##effbff blog-list-item'>
                  <Divider orientation='left'>
                    <Link to={`/repos/${item.id}`} className='text-#394d69'>
                      <span className='font-semibold lh-1.2 cursor-pointer text-1.4rem'>{item.name}</span>
                    </Link>
                    <span className='text-.5em pl-20px'>{dayjs(item.created_at).format('YYYY-MM-DD')}</span>
                  </Divider>

                  <div
                    onClick={(e) => naviagate(`/repos/${item.id}`)}
                    className='article max-h-260px overflow-hidden cursor-pointer'
                  >
                    {item.description}
                  </div>
                </li>
              );
            })}
            {/* <Pagination
              className='text-right'
              hideOnSinglePage
              current={data.current}
              pageSize={data.pageSize}
              total={data.total}
              onChange={handlePageChange}
              simple={viewWidth <= 736}
            /> */}
          </ul>

          {/* <div className='fixed top-90px right-20px w-260px'>
            <Divider>文章列表</Divider>
            <ul>
              {data.results.map((r) => (
                <li key={r.id} className='hover:bg-#f0f2f5'>
                  <Link to={`/posts/${r.id}`} className='block text-#8590a6 truncate' title={r.title}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}
        </>
      )}
    </div>
  );
}
