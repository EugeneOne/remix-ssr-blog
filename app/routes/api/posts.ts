import { ActionFunction, createCookie, redirect } from 'remix';
import { getUserProfile } from '~/auth.server';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';
import axios from 'axios';

import type { PostListItem } from '~/export.types';

const XAuthToken = 'P8OtOyR7PJyTQpQfmMeyF7KyFEBtP3A7jXJdyWf4'

export const action: ActionFunction = async ({ request }) => {
  const query = await parseFormData(request);
  const actionType = query.actionType;

  if (actionType === 'api_get_posts') return api_get_posts(query);
  else if (actionType === 'api_delete_post') await api_delete_post(query.postId);

  return redirect(query.redirectUrl || request.url);
};

// export async function api_get_posts(query: any): Promise<Page<PostListItem>> {
//   const pageSize = Number(query.pageSize || 10);
//   const current = Number(query.current || 1);

//   const where = {
//     id: { not: '1024' },
//     OR: query.k ? [{ title: { contains: String(query.k) } }, { content: String(query.k) }] : undefined,
//     tag: { every: { name: query.tag } },
//     cate: { every: { name: query.cate } },
//   };

//   const searchConfig: any = query.onlyPosts
//     ? {
//         select: { title: true, createdAt: true, id: true },
//       }
//     : {
//         include: {
//           tag: true,
//           cate: true,
//           comment: {
//             include: {
//               reply: { select: { id: true } },
//             },
//           },
//         },
//       };

//   const results = await db.post.findMany({
//     take: pageSize,
//     skip: (current - 1) * pageSize,
//     where,
//     ...searchConfig,
//     orderBy: { createdAt: 'desc' },
//   });

//   const total = await db.post.count({ where });

//   return { results, total, current, pageSize } as Page<PostListItem>;
// }

export async function api_get_posts(): Promise<Page<any>> {

  const url = "https://www.yuque.com/api/v2/users/1012120/repos"

  const res = await axios.get(url, { headers: {'X-Auth-Token': XAuthToken}});
  // console.log('posts:', result.data);
  const result = res.data;
  return result as any;
}

export async function api_get_docs(reposId: number): Promise<Page<any>> {

  const url = `https://www.yuque.com/api/v2/repos/${reposId}/docs`

  const res = await axios.get(url, { headers: {'X-Auth-Token': XAuthToken}});
  // console.log('posts:', result.data);
  const result = res.data;
  return result as any;
}

export async function api_get_doc_by_id(docId: number, slug: string): Promise<Page<any>> {

  const url = `https://www.yuque.com/api/v2/repos/${docId}/docs/${slug}`

  const res = await axios.get(url, { headers: {'X-Auth-Token': XAuthToken}});
  // console.log('posts:', result.data);
  const result = res.data;
  return result as any;
}

export async function api_get_post_by_id(postId: string) {
  const data = await db.post.findUnique({
    where: { id: postId },
    include: {
      tag: true,
      cate: true,
      comment: {
        include: {
          reply: {
            include: { user: true },
            orderBy: { createdAt: 'asc' },
          },
          user: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (data) {
    await db.post.update({
      where: { id: postId },
      data: { view: (data?.view || 0) + 1 },
    });
  }

  return data;
}

export async function api_delete_post(postId: string) {
  await db.tag.deleteMany({ where: { postId } });
  await db.category.deleteMany({ where: { postId } });
  await db.comment.deleteMany({ where: { postId } });
  await db.post.delete({ where: { id: postId } });
  await db.msg.deleteMany({ where: { postId: postId } });
}
