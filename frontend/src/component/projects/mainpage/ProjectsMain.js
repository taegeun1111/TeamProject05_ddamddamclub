import React, {useState, useEffect, useRef} from 'react';
import ProjectsItem from "./ProjectsItem";
import Common from "../../common/Common";
import {PROJECT} from "../../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import less from "../../../src_assets/less.png";
import than from "../../../src_assets/than.png";

const ProjectsMain = ({headerInfo}) => {

    //인기프로젝트 페이지 값
    const [mainCurrentPage, setMainCurrentPage] = useState(1);
    const handleCarouselIndexChange= (currentPage)=>{
        setMainCurrentPage(currentPage);
        console.log(`현재 main의 페이지 번호 : `,currentPage)
    }
  console.log(headerInfo)


  const navigate = useNavigate();
  const childRef = useRef(null);

  const pageSize = 3;

  const [currentUrl, setCurrentUrl]
    = useState(PROJECT);
  const popularity = PROJECT + `?sort=like&page=${mainCurrentPage}&size=${pageSize}`;
  // const popularity = PROJECT + `?sort=like&page=1&size=3`;
    useEffect(()=>{

    },[mainCurrentPage,popularity])


  const handleFrontClick = () => {
    console.log("프론트")
    setCurrentUrl(PROJECT + '?position=front');
  };

  const handleBackClick = () => {
    console.log("백")
    setCurrentUrl(PROJECT + '?position=back');
  };

  const handleLikeClick = (projectId) => {
    // 서버에 좋아요 처리를 위한 POST 요청을 보냅니다
    fetch(PROJECT + `/like/${projectId}`, {
      method: 'POST',
      headers: headerInfo
    })
      .then(res => {
        if (res.status === 200) return res.json()
      })
      .then(data => {
        console.log(data);
        childRef.current.fetchData(); // 자식 컴포넌트의 함수 호출
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };



  const handleShowDetails = (projectIdx) => {
    console.log('게시판 번호: ', projectIdx);

    navigate(`/projects/detail?projectIdx=${projectIdx}`, {state: {headerInfo}});
  };



  return (
    <>
      <Link to={'/projects/write'} className={'projects-write-btn'}>
        작성하기
      </Link>

      <ProjectsItem
        url={popularity}
        sortTitle={'인기 프로젝트'}
        handleLikeClick={handleLikeClick}
        handleShowDetails={handleShowDetails}
        onCarouselIndexChange = {handleCarouselIndexChange}
        pageSize = {pageSize}
        ref={childRef}
      />

      {/*<ProjectsItem*/}
      {/*  url={currentUrl}*/}
      {/*  sortTitle={'최신 프로젝트'}*/}
      {/*  handleLikeClick={handleLikeClick}*/}
      {/*  handleShowDetails={handleShowDetails}*/}
      {/*  ref={childRef}*/}
      {/*/>*/}
    </>
  );
};
export default ProjectsMain;