import { google } from "googleapis";

export const getServerSideProps = async () => {
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
  const posts = data.values;

  return {
    props: {
      posts,
    }
  }
}

const Posts = ({ posts }) => {
  return (
    <main>
      {posts.map(([title, content], index) => (
        <section key={index}>
          <h2>{title}</h2>
          <p>{content}</p>
        </section>
      ))}
    </main>
  );
}

export default Posts;