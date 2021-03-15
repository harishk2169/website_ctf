import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import ProblemsSection from "./ProblemsSection";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Loading from "../Components/Loading";
import Pagination from "./Pagination";

const GET_PROBLEMS_BY_CATEGORY = gql`
  query getProblemByCategory($category: String!) {
    getProblemsByCategory(category: $category) {
      id
      title
      statement
      solution
      fileURL
      points
      hints
      category
      submissions
      accepted
    }
  }
`;

export default function Allquestion({ category }) {
  const { data, error, loading } = useQuery(GET_PROBLEMS_BY_CATEGORY, {
    variables: { category },
  });
  // console.log(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }
  if (loading) return <Loading loading={loading} />;

  const questions = data.getProblemsByCategory;
  // adding pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = questions.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="pagination">
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={questions.length}
          paginate={paginate}
        />
      </div>
      <ProblemsSection questions={currentPosts} />
    </div>
  );
}
