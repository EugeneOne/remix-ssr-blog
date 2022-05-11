import { LoaderFunction, useLoaderData, useOutletContext } from 'remix';

import { api_get_doc_by_id } from '../../api/posts';


export const loader: LoaderFunction = async ({ request, params }) => {
  const data = await api_get_doc_by_id(Number(params.repoId), params.docSlug || '');
  return data;
};

interface LoaderData {
  data: any[];
}

export default function DocSlug() {
  const loaderData = useLoaderData<LoaderData>();
  const data = loaderData.data;
  const html = '<meta name="referrer" content="no-referrer" />' + data.body_html

  return (
    <div>
      <div className='article' dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
