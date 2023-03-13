import Image from "next/image";
import Link from "next/link";
import { google } from "googleapis";

export const getServerSideProps = async () => {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = await google.auth.getClient({ scopes });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetName = 'posts';
  const range = `${sheetName}!A2:Z101`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });
  const { data } = response;
  const posts = data.values;

  return {
    props: {
      posts,
    }
  }
}

const Posts = ({ posts }) => {
  return (
    <main className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog posts</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ab impedit assumenda modi quidem. Ullam voluptatibus blanditiis obcaecati sequi deleniti possimus eius, cumque, laborum iure nemo nisi aliquam praesentium similique.
          </p>
        </div>
        <section className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map(([title, content, date, category, author], index) => (
            <article key={index} className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800 flex max-w-xl flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={date} className="text-gray-500">
                  {date}
                </time>
                <a
                  href={category}
                  className="relative z-10 rounded-full bg-gray-50 py-1.5 px-3 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {category}
                </a>
              </div>
              <div className="group relative">
                <Link href={`posts/${index + 1}`} passHref>
                  <h2 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    {title}
                  </h2>
                  <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: content?.replaceAll('\\n', ' ') }}></p>
                </Link>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4">
                <Image src={`https://api.dicebear.com/5.x/fun-emoji/png?seed=${author}`} width='100' height='100' alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    <a href={`https://api.dicebear.com/5.x/fun-emoji/png?seed=${author}`}>
                      {author}
                    </a>
                  </p>
                  <p className="text-gray-600">{author}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Posts;