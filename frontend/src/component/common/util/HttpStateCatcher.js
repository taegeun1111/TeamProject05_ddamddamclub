/**
 * 에러 Http status 를 처리하는 역할
 * ❗ 200 일 경우는 각자 컴포넌트에서 처리합니다.
 * @param status - Http 상태코드
 */

export function httpStateCatcher (status) {
  if (status === 400) {
    alert('제목은 100자 이내, 내용은 1000자 이내로 공백없이 작성해주세요.');
    return;
  } else if (status === 401) {
    alert('로그인이 만료되었습니다.');
    window.location.href = "/";
  } else if (status === 403) {
    alert('권한이 없습니다.');
    window.location.href = "/";
  } else if (status === 404) {
    alert('요청을 찾을 수 없습니다.');
    return;
  } else if (status === 500) {
    alert('잠시 후 다시 접속해주세요.[서버오류]');
    return;
  }
}
