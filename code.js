function fetchGitHubCommits() {
  const repos = ["Repo-1", "Repo-2", "Airbnb"];
  const owner = "anish-acharya123";
  const token = "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";

  const startTime = new Date();
  startTime.setHours(8, 0, 0);
  const endTime = new Date();
  endTime.setHours(13, 0, 0);
  console.log(endTime);

  const headers = {
    Authorization: `token ${token}`,
  };

  const sheetCreated = () => {
    let spreadSheet;
    try {
      spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      console.log("No Active Spreadsheet found");
      spreadSheet = SpreadsheetApp.create("New Spreadsheet.");
    }
    const sheet = spreadSheet.getActiveSheet();
    sheet.clear();
    return sheet;
  };

  const sheet = sheetCreated();
  // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow(["Repository", "Commit Message", "Author", "Date", "Sha"]);

  repos.forEach((repo) => {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${startTime.toISOString()}&until=${endTime.toISOString()}`;
      const response = UrlFetchApp.fetch(url, { headers });
      const commits = JSON.parse(response.getContentText());

      commits.forEach((commit) => {
        const sha = commit.sha;
        const message = commit.commit.message;
        const author = commit.commit.author.name;
        const date = ConvetToLocal(commit.commit.author.date);
        console.log(date);
        sheet.appendRow([repo, message, author, date, sha]);
      });
    } catch (e) {
      console.log("Error while fetching repos", e);
    }
  });
}

const ConvetToLocal = (utcString) => {
  const utcDate = new Date(utcString);
  return utcDate.toLocaleString();
};
