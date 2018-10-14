import { Client } from "pg";

class ScoresRepository {
  data = {
    data: [
      {
        user: {
          name: "Foo",
          wins: 5
        }
      },
      {
        user: {
          name: "Roo",
          wins: 2
        }
      }
    ]
  };

  client = new Client();

  /**
   * 
   */
  async scores() {
    await this.client.connect();
    console.log("PGUSER:" + process.env.PGUSER);
    console.log("PGPASSWORD:" + process.env.PGPASSWORD);
    console.log("PGDATABASE:" + process.env.PGDATABASE);
    let result = await this.client.query(`SELECT * FROM tokuten.test`);
    await this.client.end();
    return result.rows;
  }
}

export default ScoresRepository;