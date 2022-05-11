import { LoaderFunction, useLoaderData, useOutletContext, useNavigate } from 'remix';
import { List } from 'antd'
import TageCatePage from '~/components/TageCatePage/TageCatePage';
import { PostListItem } from '~/export.types';
import { parseUrl } from '~/utils';

import { api_get_docs } from '../api/posts';


export const loader: LoaderFunction = async ({ request, params }) => {
  const data = await api_get_docs(Number(params.repoId));
  
  return data;
};

interface LoaderData {
  data: any[];
}

export default function RepoId() {
  const context = useOutletContext<GlobalContext>();
  const naviagate = useNavigate();

  const loaderData = useLoaderData<LoaderData>();
  

  return (
    <List
      itemLayout="horizontal"
      dataSource={loaderData.data}
      renderItem={item => (
        <List.Item onClick={() => naviagate(`/repoDocs/${item.book_id}/${item.slug}`)}>
          <List.Item.Meta
            // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
        
    />
  );
}
