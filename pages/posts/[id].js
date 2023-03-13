import Image from "next/image";
import Link from "next/link";
import { google } from "googleapis";
import { FaArrowLeft } from "react-icons/fa";

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
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
  const [title, content, date, category, author] = data.values[id - 1];

  return {
    props: {
      title,
      content,
      date,
      category,
      author,
    }
  }
}

const Post = ({ title, content, date, category, author }) => {
  return (
    <main className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto lg:mx-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl max-w-2xl mb-5">{title}</h1>
          <div className="flex justify-between">
            <Link className="flex items-center gap-x-2 text-xs mb-5 font-medium text-gray-600" href={'/posts'} passHref>
              <FaArrowLeft /> Voltar
            </Link>
            <div className="flex items-center gap-x-4 text-xs mb-5">
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
          </div>
        </div>
        <section className="mx-auto grid border-t border-gray-200 pt-10 sm:pt-16">
          <article className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800 flex flex-col items-start justify-between">
            <p className="text-sm leading-6 text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: content?.replaceAll('\\n', ' ') }}></p>
          </article>
          <div className="relative mt-8 flex items-center gap-x-4">
            <Image src={`https://api.dicebear.com/5.x/fun-emoji/png?seed=${author}`} width='100' height='100' alt="" className="h-10 w-10 rounded-full bg-gray-50" />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <a href={`https://api.dicebear.com/5.x/fun-emoji/png?seed=${author}`}>
                  <span className="absolute inset-0" />
                  {author}
                </a>
              </p>
              <p className="text-gray-600">{author}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Post;