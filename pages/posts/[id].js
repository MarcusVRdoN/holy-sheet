import { google } from "googleapis";

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const auth = await google.auth.getClient({ scopes });
  const sheets = google.sheets({ version: 'v4', auth });
  const sheetName = 'posts';
  const range = `${sheetName}!A2:B101`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });
  const { data } = response;
  const [title, content] = data.values[id - 1];

  return {
    props: {
      title,
      content,
    }
  }
}

const Post = ({ title, content }) => {
  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </article>
  );
}

export default Post;