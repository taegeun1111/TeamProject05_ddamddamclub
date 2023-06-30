import React, {useEffect, useState} from 'react';
import Common from "../common/Common";
import ProjectsTitle from "./main/ProjectsTitle";
import {PROJECT} from "../common/config/HostConfig";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import './scss/ProjectDetail.scss';
import {getToken, getUserIdx, getUserNickname} from "../common/util/login-util";
import { format } from 'date-fns';

const ProjectsDetail = () => {
  const ACCESS_TOKEN = getToken();
  const headerInfo = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectIdx = searchParams.get('projectIdx');
  const [projectDetail, setProjectDetail] = useState([]);
  const [fileUrl, setFileUrl] = useState(''); // 새로운 상태 추가
  const [applyButtonColor, setApplyButtonColor] = useState(''); // New state variable
  const [offerPeriodFormatted, setOfferPeriodFormatted] = useState(''); // 새로운 상태 추가

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
          fetchProjectDetail();
        })
        .catch(error => {
          console.log('Error:', error);
        });
  };


  const fetchProjectDetail = () => {

    fetch(PROJECT + `/detail/${projectIdx}`, {
      method: 'GET',
      headers: headerInfo
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          return response.json();
        })
        .then(data => {
          setProjectDetail([data.payload]);
          console.log("프로젝트 디테일 dto")
          console.log(` 마감 일자 형식 변경 ${data.payload.offerPeriod}`);
          const offer=data.payload.offerPeriod;
          const offerPeriodFormatted = format(new Date(offer), 'yyyy년 MM월 dd일 HH시 mm분');
          setOfferPeriodFormatted(offerPeriodFormatted);

          // 내 게시글 신청하기 버튼 색상 변경
          const b_writer = data.payload.boardWriter;
          const userNickname = getUserNickname();
          console.log(`내 게시글인가용 ? ${b_writer} = ${userNickname}`);

          const isOwner = b_writer === userNickname;
          setApplyButtonColor(isOwner ? 'gray' : ''); // Set the button color based on ownership
        })
        .catch(error => {
          console.error(error);
        });
  };


  const fileRequestURL = `${PROJECT}/load-s3`;

  const fetchFileImage = async () => {
    const res = await fetch(
        `${fileRequestURL}?projectIdx=${projectIdx}`, {
          method: 'GET',
        });
    if (res.status === 200) {
      const imgUrl = await res.text();
      setFileUrl(imgUrl);
      // console.log(`프로젝트 디테일 - 이미지 : ${imgUrl}`);
    } else {
      console.log(await res.text())
      setFileUrl(null);
    }
  };


  useEffect(() => {
    fetchProjectDetail();
    fetchFileImage();
  }, []);

  const handleDelete = (id) => {
    console.log("delete id : " + id);
    if (window.confirm("삭제 하시겠습니까?")) {

      fetch(PROJECT + `/${projectIdx}`, {
        method: 'DELETE',
        headers: headerInfo
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to delete project');
            }
            console.log('삭제됨');
            navigate('/projects');
            setProjectDetail([response.payload]);

          })
          .catch(error => {
            console.error(error);
          });
    }
  };

  const handleApply = () => {
    if (window.confirm('정말로 신청하시겠습니까?')) {
      fetch(PROJECT + `/applicant/${projectIdx}`, {
        method: 'PATCH',
        headers: headerInfo,
        body: JSON.stringify({}),
      })
          .then((response) => {
            if (response.status === 400) {
              return response.text();
            }
            console.log('신청 성공')
            console.log(response.json());
            fetchProjectDetail();
            alert('신청이 완료되었습니다');
          })
          .then((errorMessage) => {
            if (errorMessage) {
              alert(errorMessage);
            }
          })
          .catch((error) => {
            console.error(error);
          });
    }
  };

  return (
      <>
        <ProjectsTitle/>
        <Common className={'project-detail-wrapper'}>
          {projectDetail.map(de => {
            return (
                <section className={'main-text-wrapper'}>
                  <div key={de.boardIdx} className={'main-wrapper'}>

                    <div className={'project-date'}>
                      <span className={'p-sub-title'}>작성일자</span>
                      <span className={'sub-content'}>{de.projectDate}</span>
                    </div>

                    <div className={'project-title'}>{de.boardTitle}</div>
                    {fileUrl && <img
                        src={fileUrl}
                        alt="Project Image" className={'project-img'}
                        style={{
                          height: 350
                        }}
                    />}
                    <section className={'info-detail-container'}>
                      <div className={'detail-wrapper'}>

                        {(getUserNickname() === de.boardWriter) && (
                            <div className={'category'}>
                              <Link to={`/projects/modify?projectIdx=${projectIdx}`}
                                    className={'modify-btn'}>
                                수정
                              </Link>
                              <span className={'delete-btn'}
                                    onClick={() => handleDelete(projectIdx)}>삭제</span>
                            </div>
                        )}

                        <div className={'category'}>
                          <span className={'p-sub-title'}>작성자</span>
                          <span className={'sub-content'}>{de.boardWriter} ({de.writerPosition})</span>
                        </div>
                        <div className={'category'}>
                          <span className={'p-sub-title'}>프로젝트 타입 : </span>
                          <span className={'sub-content'}>{de.projectType}</span>
                        </div>
                        <div>
                          <div className={'category'}>
                            <span className={'p-sub-title'}>FRONT</span>
                            <span className={'sub-content'}>{de.applicantOfFront}</span>
                            /
                            <span className={'sub-content'}>{de.maxFront}</span>
                          </div>
                          <div className={'category'}>
                            <span className={'p-sub-title'}>BACK</span>
                            <span className={'sub-content'}>{de.applicantOfBack}</span>
                            /
                            <span className={'sub-content'}>{de.maxBack}</span>
                          </div>
                        </div>

                        <div className={'category'}>
                          <span className={'p-sub-title'}>모집 마감 일자</span>
                          {/*<span className={'sub-content'}>{de.offerPeriod}</span>*/}
                          <span className={'sub-content'}>{offerPeriodFormatted}</span>

                        </div>
                      </div>
                    </section>
                    <section className={'main-content'}>{de.boardContent}</section>

                    <div className={'btn-wrapper'}>
                      <div className={'like-wrapper'}
                           onClick={(e) => {
                             handleLikeClick(projectIdx);
                           }}
                      >
                        <div className={'like-btn'}>♥ {de.likeCount}</div>
                      </div>

                      <section className={'apply-wrapper'}>
                        <div className={'apply-btn'}
                             style={{backgroundColor: applyButtonColor}} // Apply the button color
                             onClick={handleApply}>신청하기
                        </div>
                      </section>
                    </div>

                  </div>
                </section>
            )
          })}
        </Common>
      </>
  );

}

export default ProjectsDetail;