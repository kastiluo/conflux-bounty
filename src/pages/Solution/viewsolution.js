import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import get from 'lodash/get';
import * as actions from './action';
import {
  commonPropTypes,
  renderAny,
  getStatusMileStone,
  i18nTxt,
  downLink,
  showLink,
  copyToClipboard,
  notice,
  getQuery,
} from '../../utils';
import { StyledWrapper } from '../../globalStyles/common';
import media from '../../globalStyles/media';
// import Input from '../../components/Input';
import Message from '../../components/Message';
import PhotoImg from '../../components/PhotoImg';
import * as s from '../Bounty/commonStyle';
import * as s1 from './commonStyle';
import BackHeadDiv from '../../components/BackHeadDiv';
import imgGoLeft from '../../assets/iconfont/go-left.svg';
import imgGoRight from '../../assets/iconfont/go-right.svg';
import UserBack from '../../assets/iconfont/user-back.svg';
import { updateShare as updateShareAction } from '../../components/Share/action';
import unitParser, { useMobile } from '../../utils/device';

import { SOLUTION_STATUS_ENUM, MILESTONE_STATUS_ENUM, BOUNTY_STATUS_ENUM } from '../../constants';
import dashedback from '../../assets/iconfont/background-dashed.svg';
import ModalComp from '../../components/Modal';
import Tooltip from '../../components/Tooltip';
import StickyNotification from '../../components/StickyNotification';

const Wrapper = styled(StyledWrapper)`
  padding: 40px;
  padding: 40px;
  .head {
    display: flex;
    align-items: center;
    > h1 {
      flex: 1;
      font-size: 32px;
      color: #171d1f;
      margin: 0;
      padding: 0;
    }
    .head-right {
      font-size: 14px;
      line-height: 14px;
      button {
        padding: 0;
        margin-right: 0;
        &:first-child {
          margin-right: 20px;
        }
      }
    }
  }
  .solution-head-list {
    display: flex;
    margin-top: 60px;
  }
  .solution-head-content {
    flex: 1;
    display: inline-block;
    text-align: center;
    .img-wrap {
      width: 80px;
      height: 80px;
      margin-right: 0;
    }
    > .solution-user {
      margin-left: 17px;
      display: inline-block;
      vertical-align: middle;
      .message-success {
        padding: 8px 12px;
        margin-top: 4px;
        > .material-icons {
          font-size: 28px;
        }
        > span {
          font-size: 14px;
          width: 90px;
        }
      }
      .solution-user-name {
        font-weight: 500;
        text-align: left;
        color: #171d1f;
        margin-bottom: 5px;
      }
    }
  }
  .solution-dots {
    margin-top: 40px;
    margin-bottom: 40px;
    text-align: center;
    .solution-dot {
      margin-left: 6px;
      margin-right: 6px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d8dddf;
      cursor: pointer;
    }
    .solution-dot-active {
      background: #595f61;
      cursor: default;
    }
  }
  .more-icon {
    vertical-align: middle;
    font-size: 14px;
    color: rgb(216, 221, 223);
  }
  .subject {
    font-weight: 500;
    margin-bottom: 20px;
  }
  .solution-detail {
    margin-bottom: 40px;
    overflow: auto;
    > pre {
      word-break: break-word;
      white-space: pre-wrap;
    }
  }
  .notemsg-detail {
    margin-bottom: 30px;

    .notemsg-status-AUDITING {
      padding: 2px;
      padding-left: 4px;
      padding-right: 4px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      border: 1px solid #e76a25;
      color: #e76a25;
    }
    .notemsg-status-DELETED {
      padding: 2px;
      padding-left: 4px;
      padding-right: 4px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
      border: 1px solid #ec6057;
      color: #ec6057;
    }
  }

  .attachment-line {
    font-size: 14px;
  }
  .solution-user-cfx {
    background: #4a9e81;
    color: #fff;
    font-size: 24px;
    line-height: 44px;
    padding-left: 12px;
    padding-right: 12px;
    font-weight: bold;
    align-items: center;
  }

  .trans-line {
    position: relative;
  }
  .trans-line::before {
    content: '';
    height: 1px;
    width: 100%;
    background: #d7dddf;
    position: absolute;
    top: 50%;
  }
  .translate-btn {
    position: relative;
    cursor: pointer;
    width: 150px;
    background: #fff;
    z-index: 2;
    border: 1px solid #d7dddf;
    box-sizing: border-box;
    border-radius: 18px;
    height: 36px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    > span {
      font-size: 16px;
      margin-left: 8px;
      color: #22b2d6;
    }
    > i {
      color: #22b2d6;
      font-size: 16px;
    }
  }
  .translate-sep {
    display: flex;
    align-items: center;
    > span {
      color: #a770ee;
      margin-right: 10px;
    }
    > i {
      flex: 1;
      height: 2px;
      background: url(${dashedback});
      background-size: cover;
      background-repeat: repeat-x;
    }
  }
  ${media.mobile`
    padding: ${unitParser(20)} ${unitParser(12)};
    pre {
      font-size: ${unitParser(14)};
      line-height: ${unitParser(20)};
    }
    .head {
      > h1 {
        font-size: ${unitParser(24)};
        line-height: ${unitParser(24)};
        font-weight: 600;
      }
      .head-right {
        font-size: ${unitParser(14)};
        line-height: ${unitParser(14)};
        button {
          padding: 0;
          margin-right: 0;
          &:first-child {
            margin-right: ${unitParser(20)};
          }
        }
      }
    }
    .subject {
      font-size: ${unitParser(16)};
      line-height: ${unitParser(16)};
      margin: ${unitParser(40)} 0 ${unitParser(12)} 0;
      font-weight: bold;
    }
    .miltstone-wrap {
      padding-top: ${unitParser(8)};
    }
    .solution-head-list {
      margin-top: ${unitParser(18)};
      .solution-head-content {
        display: flex;
        justify-content: center;
        position: relative;
        .solution-user {
          position: absolute;
          bottom: -36px;
          margin: 0;
          display: flex;
          margin-bottom: 0;
          flex-direction: column-reverse;
          .solution-user-name {
            margin-top: 3px;
            font-size: ${unitParser(14)};
            line-height: ${unitParser(14)}
            text-align: center;
          }
          .solution-user-cfx {
            font-size: ${unitParser(16)};
            line-height: ${unitParser(16)};
            padding: ${unitParser(7)} ${unitParser(16)};
          }
        }
      }
    }
    .solution-dots {
      margin-top: ${unitParser(45)};
    }
    .trans-line {
      margin-top: ${unitParser(40)};
      margin-bottom: ${unitParser(20)};
    }
    .notemsg-detail {
      > p {
        font-size: ${unitParser(14)};
        line-height: ${unitParser(20)};
      }
    }
  `}
`;

const AddNoticeDiv = styled.div`
  width: 100%;
  height: 60px;
  background: #3b3d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -40px;
  margin-bottom: 40px;
  > span {
    color: #fff;
    margin-right: 20px;
  }
  ${media.mobile`
    position: fixed;
    z-index: 999;
    bottom: 0;
    height: ${unitParser(84)};
    margin: 0;
    padding: ${unitParser(20)}
    > span {
      flex: 1;
      font-size: ${unitParser(16)}
      line-height: ${unitParser(20)}
    }
    > button {
      font-size: ${unitParser(16)}
      width: ${unitParser(65)};
      box-sizing: border-box;
      padding: 0;
    }
`}
`;

const EditNotePanel = styled.div`
  background: #fff;
  box-shadow: 2px 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 20px;
  width: 400px;
  position: relative;
  h5 {
    padding-top: 6px;
    margin: 0;
    font-size: 20px;
    line-height: 20px;
    color: #171d1f;
    padding-bottom: 20px;
  }
  textarea {
    height: 200px;
    margin-bottom: 20px;
  }
  > .btn {
    width: 100%;
  }
  > .close {
    position: absolute;
    color: #8e9394;
    font-weight: 500;
    top: 23px;
    right: 10px;
    font-style: normal;
    font-weight: bold;
    cursor: pointer;
    outline: none;
  }
  ${media.mobile`
    width: 100%;
    padding: 0;
    box-shadow: unset;
    position: relative;
    h5 {
      font-size: ${unitParser(24)};
      line-height: ${unitParser(24)};
    }
    textarea {
      height: 100px;
    }
    > .close {
      top: 4px;
    }
`}
`;

const addedContent = content => {
  return `${i18nTxt('Your added content is not approved. Here is the reason:')} ${content}`;
};

function ViewSolution({
  getSolutionView,
  submissionId,
  getLike,
  updateView,
  history,
  resetView,
  freshSubmissionDesc,
  user,
  viewSolution,
  submitNote,
  renderReward,
  insideBounty,
  sendLike,
  from,
  headDiv,
  updateShare,
}) {
  const getInitData = () => {
    updateView({
      addTranslate: false,
      descriptionTranslated: '',
      milestoneListTraqnslated: [],
    });

    let subId;
    if (insideBounty) {
      subId = submissionId;
    } else {
      subId = getQuery().submissionId;
    }
    getSolutionView(subId);
    getLike(subId);
  };

  const renderAddNote = () => {
    const { showEditNoteMsg } = viewSolution;

    const inStatus = viewSolution.bounty.status === 'OPEN' || viewSolution.bounty.status === 'ONGOING';
    let AddSDiv;
    if (user.id === viewSolution.user.id && inStatus) {
      AddSDiv = (
        <AddNoticeDiv>
          <span>{i18nTxt('You can add additional contents to your submission.')}</span>
          <button
            className="btn waves-effect waves-light primary"
            type="button"
            onClick={() => {
              updateView({
                showEditNoteMsg: true,
              });
            }}
          >
            {i18nTxt('ADD')}
          </button>
        </AddNoticeDiv>
      );
    }
    const closeNotePanel = () => {
      updateView({
        showEditNoteMsg: false,
      });
    };

    // const rejectReason = <div style={{ width: 600, margin: '0 auto', marginBottom: 40 }}>
    //   <Message type="message-important-light">
    //     qweqweqeqe
    //   </Message>
    // </div>

    const isMobile = useMobile();

    const editNoteMsgDiv = (
      <ModalComp show mobilePosBottom={isMobile} onEsc={closeNotePanel}>
        <EditNotePanel>
          <button className="material-icons close" onClick={closeNotePanel} type="button">
            close
          </button>
          <h5>{i18nTxt('Add additional contents')}</h5>
          <div>
            <textarea
              className={cx('materialize-textarea')}
              onChange={e => {
                updateView({
                  addNoteTxt: e.target.value,
                });
              }}
              placeholder={i18nTxt('Tell us what to be added to your submission...')}
            ></textarea>
          </div>
          <button
            className="btn waves-effect waves-light primary"
            type="button"
            onClick={() => {
              submitNote();
            }}
          >
            {i18nTxt('SUBMIT')}
          </button>
        </EditNotePanel>
      </ModalComp>
    );

    return (
      <Fragment>
        {/* {rejectReason} */}
        {AddSDiv}
        {showEditNoteMsg && editNoteMsgDiv}
      </Fragment>
    );
  };

  useEffectOnce(() => {
    if (history.action === 'PUSH') {
      resetView();
    }
    getInitData();
  });

  const isMobile = useMobile();

  let curIndex = -1;
  let listDiv;
  if (viewSolution.solutionList.length > 1) {
    listDiv = [];
    viewSolution.solutionList.forEach((solution, index) => {
      if (solution.id === submissionId) {
        curIndex = index;
        listDiv.push(<i className="solution-dot solution-dot-active" data-solutionId={solution.id}></i>);
        return;
      }

      const gotoCurSolution = () => {
        history.push(`/view-submission?submissionId=${solution.id}`);
        if (insideBounty !== true) {
          setTimeout(getInitData);
        }
      };
      /* eslint jsx-a11y/no-static-element-interactions: 0 */
      /* eslint jsx-a11y/click-events-have-key-events: 0 */
      listDiv.push(<i onClick={gotoCurSolution} className="solution-dot" data-solutionId={solution.id}></i>);
    });
  }

  const maxShow = 22;
  if (viewSolution.totalSubmission > maxShow && curIndex !== -1) {
    const listNew = [<i className="solution-dot solution-dot-active"></i>];
    let looping = true;
    let beforeIndex = curIndex - 1;
    let afterIndex = curIndex + 1;
    while (looping) {
      if (beforeIndex >= 0) {
        listNew.unshift(listDiv[beforeIndex]);
        beforeIndex -= 1;
      }

      if (afterIndex < viewSolution.solutionList.length) {
        listNew.push(listDiv[afterIndex]);
        afterIndex += 1;
      }

      if (listNew.length >= maxShow) {
        looping = false;
      }
    }

    if (beforeIndex > 0) {
      listNew.unshift(<i className="more-icon material-icons dp48">more_horiz</i>);
    }
    if (afterIndex < viewSolution.solutionList.length) {
      listNew.push(<i className="more-icon material-icons dp48">more_horiz</i>);
    }
    listDiv = listNew;
  }

  const hDiv = headDiv || (
    <BackHeadDiv onClick={() => history.push(`/view-bounty?bountyId=${viewSolution.bountyId}`)}>
      <span>{viewSolution.bounty && viewSolution.bounty.title}</span>
    </BackHeadDiv>
  );

  let deletedNote;
  if (viewSolution.addTranslate) {
    deletedNote = viewSolution.noteListTranslated[viewSolution.noteListTranslated.length - 1];
  } else {
    deletedNote = viewSolution.noteList[viewSolution.noteList.length - 1];
  }
  if ((deletedNote && deletedNote.status !== 'DELETED') || user.id !== viewSolution.user.id) deletedNote = undefined;

  return (
    <React.Fragment>
      {renderAddNote()}
      {deletedNote && <StickyNotification type="warning" content={addedContent(deletedNote && deletedNote.rejectMessage)} />}
      {hDiv}
      <Wrapper>
        <div className="head">
          <h1>{i18nTxt('Submissions')}</h1>

          <div className="head-right">
            <s.LikeAndShare>
              <button
                type="button"
                onClick={() => {
                  sendLike(submissionId, viewSolution.isLike ? 'del' : 'add');
                }}
              >
                <i className={cx('material-icons dp48', { like: viewSolution.isLike })}>grade</i>
                {viewSolution.likeNumber > 0 ? <span>{viewSolution.likeNumber}</span> : null}
                <span>{viewSolution.likeNumber > 1 ? i18nTxt('Likes') : i18nTxt('Like')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isMobile) {
                    copyToClipboard(window.location.href);
                    notice.show({ content: i18nTxt('Link Copied'), type: 'message-success', timeout: 3000 });
                    return;
                  }

                  updateShare({
                    show: true,
                    qrTxt: window.location.href,
                  });
                }}
              >
                <i className="share" />
                <span>{i18nTxt('Share')}</span>
              </button>
            </s.LikeAndShare>
          </div>
        </div>

        {renderReward()}

        <div className="solution-head-list">
          {renderAny(() => {
            if (from === 'mysubmission') {
              return null;
            }
            if (viewSolution.status === SOLUTION_STATUS_ENUM.PENDING) {
              return null;
            }
            if (curIndex === 0 || curIndex === -1) {
              return (
                <img
                  style={{
                    opacity: 0.6,
                  }}
                  src={imgGoLeft}
                  alt="imggoleft"
                />
              );
            }
            return (
              <Link
                onClick={() => {
                  if (insideBounty !== true) {
                    setTimeout(getInitData);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  visibility: isMobile ? 'hidden' : 'visible',
                }}
                to={`/view-submission?submissionId=${get(viewSolution, ['solutionList', curIndex - 1, 'id'])}`}
              >
                <img
                  style={{
                    opacity: curIndex === 0 ? 0.6 : 1,
                  }}
                  src={imgGoLeft}
                  alt="imggoleft"
                />
              </Link>
            );
          })}
          <div className="solution-head-content">
            <PhotoImg className="img-wrap" imgSrc={viewSolution.user.photoUrl || UserBack} />
            {renderAny(() => {
              if (viewSolution.status === SOLUTION_STATUS_ENUM.PENDING) {
                return null;
              }
              if (viewSolution.status === SOLUTION_STATUS_ENUM.FINISHED && viewSolution.bounty.status === BOUNTY_STATUS_ENUM.FINISHED) {
                return (
                  <span className="solution-user">
                    <div
                      style={{
                        fontWeight: 500,
                        color: '#171D1F',
                        marginBottom: 5,
                      }}
                    >
                      {' '}
                      {viewSolution.user.nickname}
                    </div>
                    <div className="solution-user-cfx">
                      <span>+{get(viewSolution, ['reward', 'fansCoin'], 0)}</span>
                      <span style={{ fontSize: 16, marginLeft: 3 }}>FC</span>
                    </div>
                  </span>
                );
              }
              if (viewSolution.status === SOLUTION_STATUS_ENUM.AUDITING) {
                return (
                  <span className="solution-user">
                    <div> {viewSolution.user.nickname}</div>
                    <Message type="message-success"> {i18nTxt('Submission Auditing!')} </Message>
                  </span>
                );
              }
              return (
                <span className="solution-user">
                  <div className="solution-user-name">{viewSolution.user.nickname}</div>
                </span>
              );
            })}
          </div>

          {renderAny(() => {
            if (from === 'mysubmission') {
              return null;
            }
            if (curIndex === viewSolution.solutionList.length - 1 || curIndex === -1) {
              return (
                <img
                  style={{
                    opacity: 0.6,
                    visibility: isMobile ? 'hidden' : 'visible',
                  }}
                  src={imgGoRight}
                  alt="imggoright"
                />
              );
            }

            return (
              <Link
                onClick={() => {
                  if (insideBounty !== true) {
                    setTimeout(getInitData);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  visibility: isMobile ? 'hidden' : 'visible',
                }}
                to={`/view-submission?submissionId=${get(viewSolution, ['solutionList', curIndex + 1, 'id'])}`}
              >
                <img
                  style={{
                    opacity: 1,
                  }}
                  src={imgGoRight}
                  alt="imgGoRight"
                />
              </Link>
            );
          })}
        </div>

        {!isMobile &&
          renderAny(() => {
            return <div className="solution-dots">{listDiv}</div>;
          })}

        <div className="trans-line">
          <button
            onClick={() => {
              freshSubmissionDesc({
                submissionId,
                language: user.language,
              });
            }}
            type="button"
            className="translate-btn"
          >
            <i className="trans-language"></i>
            <span>{i18nTxt('TRANSLATE')}</span>
          </button>
        </div>

        <div className="subject">{i18nTxt('Details of submission')}:</div>

        <div className="solution-detail">
          <pre>{viewSolution.description}</pre>
          {renderAny(() => {
            if (viewSolution.addTranslate) {
              return (
                <Fragment>
                  <div className="translate-sep">
                    <span>{i18nTxt('Translate')}: </span>
                    <i></i>
                  </div>
                  <pre>{viewSolution.descriptionTranslated}</pre>
                </Fragment>
              );
            }
            return null;
          })}
        </div>

        {renderAny(() => {
          const renderNote = noteList => {
            if (noteList.length) {
              return (
                <div>
                  <div className="subject">{i18nTxt('Added Contents')}:</div>
                  <div className="notemsg-detail">
                    {noteList.map(v => {
                      if (user.id === viewSolution.user.id) {
                        let statusDiv;
                        if (v.status === 'DELETED') {
                          statusDiv = (
                            <Tooltip direction="topRight" tipSpan={<span> {i18nTxt(`submission.note.${v.status}`)}</span>}>
                              <div>{v.rejectMessage}</div>
                            </Tooltip>
                          );
                        } else {
                          statusDiv = <span> {i18nTxt(`submission.note.${v.status}`)}</span>;
                        }
                        return (
                          <p>
                            <span>{v.description}</span>
                            <div className={`notemsg-status-${v.status}`}>{statusDiv}</div>
                          </p>
                        );
                      }

                      if (v.status === 'APPROVED') {
                        return (
                          <p>
                            <span>{v.description}</span>
                          </p>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              );
            }
            return null;
          };

          if (viewSolution.addTranslate) {
            if (viewSolution.noteListTranslated && viewSolution.noteListTranslated.length > 0) {
              return (
                <Fragment>
                  {renderNote(viewSolution.noteListTranslated || [])}
                  <div className="translate-sep">
                    <span>{i18nTxt('Translate')}: </span>
                    <i></i>
                  </div>
                  {renderNote(viewSolution.noteListTranslated || [])}
                </Fragment>
              );
            }
            return null;
          }
          return renderNote(viewSolution.noteList || []);
        })}

        {renderAny(() => {
          let msgDiv;
          if (viewSolution.bounty.status === BOUNTY_STATUS_ENUM.AUDITING) {
            msgDiv = (
              <div style={{ marginBottom: 40 }}>
                <Message type="message-notice">{i18nTxt('We will assign the rewards after having finished the Bounty.')}</Message>
              </div>
            );
          }
          return msgDiv;
        })}

        {renderAny(() => {
          if (viewSolution.attachmentList.length) {
            return (
              <div>
                <div className="subject" style={{ marginBottom: 0 }}>
                  {i18nTxt('Attachments')}:
                </div>
                <div style={{ marginBottom: 20 }}>
                  <s.AttachmentDiv>
                    {viewSolution.attachmentList.map(v => {
                      return (
                        <div className="attachment-line">
                          {' '}
                          {isMobile ? showLink(v.url, v.title, viewSolution.attachmentList) : downLink(v.url, v.title)}
                        </div>
                      );
                    })}
                  </s.AttachmentDiv>
                </div>
              </div>
            );
          }
          return null;
        })}

        {renderAny(() => {
          if (viewSolution.bounty.milestoneLimit === 0) {
            return null;
          }

          return (
            <Fragment>
              <div className="subject">{i18nTxt('Milestone')}:</div>
              <div className="miltstone-wrap">
                {renderAny(() => {
                  return viewSolution.milestoneList.map((milest, index) => {
                    let approveDiv;
                    if (
                      milest.status === MILESTONE_STATUS_ENUM.ONGOING ||
                      milest.status === MILESTONE_STATUS_ENUM.AUDITING ||
                      milest.status === MILESTONE_STATUS_ENUM.FINISHED
                    ) {
                      approveDiv = (
                        <s1.StatusTagDiv className={milest.status} style={{ marginTop: 20 }}>
                          {getStatusMileStone(milest.status)}
                        </s1.StatusTagDiv>
                      );
                    }
                    const attachList = milest.attachmentList || [];

                    return (
                      <s1.MileStoneProgress>
                        <div className="milestone-step">{s1.stepBoxLine(milest.status, index, viewSolution.milestoneList.length)}</div>

                        <div className="milestone-right">
                          <div className="duration">
                            {milest.duration} {milest.duration > 1 ? i18nTxt('days') : i18nTxt('day')}
                          </div>
                          <h5>{milest.title}</h5>
                          <p>{milest.description}</p>
                          <p>{milest.proof}</p>
                          <s.AttachmentDiv>
                            {attachList.map(v => {
                              return (
                                <div className="attachment-line">
                                  {' '}
                                  {isMobile ? showLink(v.url, v.title, attachList) : downLink(v.url, v.title)}
                                </div>
                              );
                            })}
                          </s.AttachmentDiv>
                          {renderAny(() => {
                            if (viewSolution.addTranslate) {
                              const milestTrans = viewSolution.milestoneListTraqnslated[index];
                              return (
                                <Fragment>
                                  <div className="translate-sep">
                                    <span>{i18nTxt('Translate')}: </span>
                                    <i></i>
                                  </div>
                                  <h5>{milestTrans.title}</h5>
                                  <p>{milestTrans.description}</p>
                                  <p>{milestTrans.proof}</p>
                                </Fragment>
                              );
                            }
                            return null;
                          })}
                          {approveDiv}
                        </div>
                      </s1.MileStoneProgress>
                    );
                  });
                })}
              </div>
            </Fragment>
          );
        })}
      </Wrapper>
    </React.Fragment>
  );
}

ViewSolution.propTypes = {
  sendLike: PropTypes.func.isRequired,
  updateShare: PropTypes.func.isRequired,
  history: commonPropTypes.history.isRequired,
  getSolutionView: PropTypes.func.isRequired,
  submissionId: PropTypes.string.isRequired,
  getLike: PropTypes.func.isRequired,
  resetView: PropTypes.func.isRequired,
  freshSubmissionDesc: PropTypes.func.isRequired,
  updateView: PropTypes.func.isRequired,
  renderReward: PropTypes.func,
  viewSolution: PropTypes.objectOf({
    user: PropTypes.objectOf({
      id: PropTypes.string,
    }),
  }).isRequired,
  submitNote: PropTypes.string.isRequired,
  user: PropTypes.objectOf({
    id: PropTypes.string,
  }).isRequired,
  insideBounty: PropTypes.bool,
  from: PropTypes.string.isRequired,
  headDiv: PropTypes.element,
};

ViewSolution.defaultProps = {
  renderReward: () => {},
  insideBounty: false,
  headDiv: null,
};

function mapStateToProps(state) {
  return {
    user: state.head.user,
    viewSolution: state.solution.viewSolution,
  };
}

export default connect(
  mapStateToProps,
  {
    ...actions,
    updateShare: updateShareAction,
  }
)(ViewSolution);
