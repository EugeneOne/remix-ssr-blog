import { LoaderFunction, useLoaderData, useOutletContext } from 'remix';
import { List } from 'antd'
import TageCatePage from '~/components/TageCatePage/TageCatePage';
import { PostListItem } from '~/export.types';
import { parseUrl } from '~/utils';

import { api_get_docs } from './api/posts';

export const loader: LoaderFunction = async ({ request }) => {
  const data = await api_get_docs();

  return { cateList, data };
};

interface LoaderData {
  cateList: CateListItem[];
  data: Page<PostListItem>;
  query: any;
}

export default function CatePage() {
  const context = useOutletContext<GlobalContext>();

  const loaderData = useLoaderData<LoaderData>();

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
            title={<a href="https://ant.design">{item.title}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )}
    />
  );
}
