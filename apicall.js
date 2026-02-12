let myHeaders = new Headers();

myHeaders.append("Content-Type", "application/json");
myHeaders.append("accept-language", "en-GB,en-US;q=0.9,en;q=0.8");
myHeaders.append("content-type", "application/json");
myHeaders.append("origin", "https://www.jobfound.org");
myHeaders.append("priority", "u=1, i");
myHeaders.append("sec-ch-ua", "Google");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "Windows");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "cross-site");

let body = JSON.stringify({
  query:
    "\n  query JobPosts($first: Int, $skip: Int) {\n    jobPosts(orderBy: createdAt_DESC, first: $first, skip: $skip) {\n      id\n      title\n      slug\n      companyImage {\n        url\n      }\n      body {\n        html\n      }\n      author\n      salary\n      createdAt\n      skill {\n        skills\n      }\n      experience {\n        experience\n      }\n      domain {\n        domain\n      }\n      jobTypeReference {\n        jobType\n      }\n      apply\n      country {\n        country\n      }\n    }\n  }\n",
});

let requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: body,
  redirect: "follow",
};

async function fetchJobPosts() {
  const res = await fetch(
    "https://ap-south-1.cdn.hygraph.com/content/clyfggcvi02yv07uxmtl5gva8/master",
    requestOptions,
  );

  const data = await res.json();
  const newdata = data.data.jobPosts;
  return newdata;
}

export default fetchJobPosts;
