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

  /**
   * 
   */
  scores() {
    return this.data;
  }
}

export default ScoresRepository;