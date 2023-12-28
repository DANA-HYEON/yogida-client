import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

import DayButton from '../Detail/DayButton';
import Button from '../commons/Button';
import Tag from '../commons/Tag';
import logo from '/logo.svg';

import {
  IoChevronBack,
  IoCalendarClear,
  IoDocumentText,
  IoLocationSharp,
  IoAccessibility,
  IoWallet,
  IoBagRemove,
  IoMap,
  IoPricetag,
} from 'react-icons/io5';

import { PATH } from '../../constants/path';
import { SearchPlace, SearchTravelDestination, SelectTag } from './Search';
import useDayCalculation from '../../hooks/useDayCalculation';
import ScheduleCalendar from './Calendar';
import useModal from '../../hooks/useModal';
import { convertSimpleDate } from '../../utils/convertSimpleDate';
import Course from './Course';
import CourseMap from '../KakaoMaps/CourseMap';
import getDistance from '../../utils/getDistance';

import { useMypagePostsQuery } from '../../pages/mypage/queries';

export default function Schedule() {
  const { openModal } = useModal();
  const navigate = useNavigate();

  const [addTravelDestination, setAddTravelDestination] = useState(false); //여행지 설정
  const [addPlan, setAddPlan] = useState(false); //장소 추가
  const [addTag, setAddTag] = useState(false); //태그 선택

  const { addPost } = useMypagePostsQuery();

  const [startDate, setStartDate] = useState(null); //시작 날짜
  const [endDate, setEndDate] = useState(null); //종료 날짜
  const [title, setTitle] = useState(''); // 제목
  const titleSize = useMemo(() => title.length, [title]); //제목 길이
  const [reviewText, setReviewText] = useState(''); // 간단 리뷰
  const [destination, setDestination] = useState(''); // 여행지
  const [peopleCount, setPeopleCount] = useState(0); //인원수
  const [cost, setCost] = useState(0); //예산
  const [isPublic, setIsPublic] = useState(true); //게시글 공개 여부
  const [schedules, setSchedules] = useState([]); // 코스 등록
  const [tag, setTag] = useState([]); //태그

  const [dayTitle, setDayTitle] = useState('');
  const [selectDay, setSelectDay] = useState(0); //선택한 day

  const schedulePerDay = useMemo(() => schedules[selectDay], [schedules, selectDay]);

  // 날짜 계산기 커스텀 훅 사용
  const dayCalculation = useDayCalculation(startDate, endDate);

  useEffect(() => {
    if (startDate && endDate && dayCalculation > 0) {
      const days = Array.from(Array(Math.ceil(dayCalculation)), () => new Array());
      setSchedules(days);
    }
  }, [dayCalculation, startDate, endDate]);

  // day별 장소 추가
  const handleSingleScheduleClick = (option) => {
    const singleSchedule = {
      id: option?.id,
      placeName: option?.place_name,
      placeImageSrc: 'default',
      star: 0,
      category: option?.category,
      placePosition: [Number(option?.y), Number(option?.x)],
    };

    setSchedules((prev) => prev.map((day, i) => (selectDay === i ? [...day, singleSchedule] : day)));
  };

  //day별 장소 삭제
  const handleRemoveSingleScheduleClick = (id) => {
    setSchedules((prev) =>
      prev.map((day, i) => (selectDay === i ? day.filter((singleSchedule) => singleSchedule.id !== id) : day)),
    );
  };

  // 장소 이미지 추가
  const handleAddPlaceImgClick = ({ id, img }) => {
    setSchedules((prev) =>
      prev.map((day, i) =>
        selectDay === i ? day.map((place) => (place?.id === id ? { ...place, placeImageSrc: img } : place)) : day,
      ),
    );
  };

  // 장소 별점 추가
  const handleAddScoreClick = ({ id, star }) => {
    setSchedules((prev) =>
      prev.map((day, i) =>
        selectDay === i ? day.map((place) => (place?.id === id ? { ...place, star } : place)) : day,
      ),
    );
  };

  //장소별 거리 계산
  const calculateDistance = () => {
    const arr = [];
    for (let i = 0; i < schedules.length; i++) {
      arr.push([]);
      const day = schedules[i];
      for (let j = 0; j < day.length - 1; j++) {
        if (!day) return;
        const currentPlace = day[j].placePosition;
        const nextPlace = day[j + 1].placePosition;
        const distance = getDistance(currentPlace[0], currentPlace[1], nextPlace[0], nextPlace[1]);
        arr[i].push(distance);
      }
    }
    return arr;
  };

  const handleDestinationClick = (text) => {
    setDestination(text);
    setAddTravelDestination(false);
  };

  const handleTagsClick = (tags) => {
    setAddTag(false);
    setTag(tags);
  };

  const onSubmit = async () => {
    const payload = {
      title,
      destination,
      startDate,
      endDate,
      tag,
      schedules: schedules.map((schedule) =>
        schedule.map((place) => {
          // eslint-disable-next-line no-unused-vars
          const { id, ...rest } = place;
          // const { id, placeImageSrc, ...resxt } = place;
          return rest;
        }),
      ),
      distances: calculateDistance(),
      cost,
      peopleCount,
      isPublic,
      reviewText,
    };
    const placeImages = schedules.map((subArray) => {
      return subArray.map((item) => item.placeImageSrc);
    });

    // console.log(placeImages);

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));

    for (let i = 0; i < placeImages.length; i++) {
      for (let j = 0; j < placeImages[i].length; j++) {
        if (placeImages[i][j] instanceof File) {
          formData.append(`image`, placeImages[i][j], `${i + 1}-${j + 1}`);
        }
      }
    }

    const result = await addPost(formData);
    if (result?.status === 200) {
      toast.success('게시글이 등록되었습니다.');
      navigate(`${PATH.post}/${result?._id}`);
    }
  };

  const onTempSave = () => {
    console.log('Temp save : ');
  };

  //여행지 검색
  if (addTravelDestination)
    return (
      <SearchTravelDestination
        handleDestinationClick={handleDestinationClick}
        onClose={() => setAddTravelDestination(false)}
      />
    );
  //장소 검색
  if (addPlan)
    return <SearchPlace handleSingleScheduleClick={handleSingleScheduleClick} onClose={() => setAddPlan(false)} />;
  //태그 선택
  if (addTag) return <SelectTag tag={tag} handleTagsClick={handleTagsClick} onClose={() => setAddTag(false)} />;

  return (
    <>
      <section className="w-full top-0 border-[#E8E8E8] border-b-[1px]">
        <header className="w-full h-header bg-white flex items-center">
          <IoChevronBack size={32} className="pl-2 cursor-pointer" onClick={() => navigate(-1)} />
          <h1 className="flex gap-[8px] mx-auto font-bold text-[18px]">
            여기다 글쓰기
            <img src={logo} alt="logo" className="w-[20px]" />
          </h1>
        </header>
      </section>
      <ul role="list">
        <ScheduleItem
          icon={<IoCalendarClear color="#589BF7" size={20} />}
          title="날짜"
          id="date"
          onClick={() =>
            openModal({
              message: <ScheduleCalendar setStartDate={setStartDate} setEndDate={setEndDate} />,
              type: 'calendar',
            })
          }
        >
          <input
            type="text"
            name="date"
            id="date"
            className="w-full focus:outline-none text-[14px] font-medium placeholder:text-[14px]"
            value={startDate && endDate ? `${convertSimpleDate(startDate)} ~ ${convertSimpleDate(endDate)}` : ''}
            readOnly
          />
        </ScheduleItem>

        <ScheduleItem icon={<IoDocumentText color="#589BF7" size={20} />} title="제목" id="title">
          <>
            <input
              type="text"
              name="title"
              id="title"
              className="w-full focus:outline-none text-[14px] font-medium placeholder:text-[14px]"
              placeholder="제목을 입력해 주세요."
              value={title}
              maxLength={20}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <span className="text-[10px]">{titleSize}/20</span>
          </>
        </ScheduleItem>
        <ScheduleItem id="review" width={'w-[0%]'}>
          <textarea
            name="reviewText"
            id="reviewText"
            cols="30"
            rows="10"
            placeholder="내용을 입력해 주세요."
            className="w-full focus:outline-none text-[14px] font-medium placeholder:text-[14px]"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
        </ScheduleItem>
        <ScheduleItem
          icon={<IoLocationSharp color="#589BF7" size={20} />}
          title="여행지"
          id="place"
          onClick={() => setAddTravelDestination(true)}
        >
          <input
            type="text"
            name="place"
            id="place"
            className="w-full focus:outline-none text-[14px] font-medium text-right bg-white placeholder:text-[14px]"
            value={destination}
            readOnly
          />
        </ScheduleItem>
        <ScheduleItem icon={<IoAccessibility color="#589BF7" size={20} />} title="인원수" id="count">
          <input
            type="number"
            name="count"
            id="count"
            className="w-full focus:outline-none text-[14px] font-medium text-right placeholder:text-[14px]"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
          />
        </ScheduleItem>
        <ScheduleItem icon={<IoWallet color="#589BF7" size={20} />} title="예산" id="budget">
          <input
            type="number"
            name="budget"
            id="budget"
            className="w-full focus:outline-none text-[14px] font-medium text-right placeholder:text-[14px]"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </ScheduleItem>
        <ScheduleItem
          icon={<IoBagRemove color="#589BF7" size={20} />}
          title="게시글 공개 여부"
          id="secret"
          width={'w-[80%]'}
        >
          <div className="flex items-center justify-end gap-[20px] w-full">
            <label htmlFor="show" className="flex items-center gap-[10px] text-[12px]">
              <input
                type="radio"
                name="secret"
                id="show"
                className="w-[20px] h-[20px]"
                checked={isPublic === true}
                // onChange={(e) => setIsPublic(e.target.value)}
                onClick={() => setIsPublic(true)}
              />
              공개
            </label>

            <label htmlFor="hidden" className="flex items-center gap-[10px] text-[12px]">
              <input
                type="radio"
                name="secret"
                id="hidden"
                className="w-[20px] h-[20px]"
                checked={isPublic === false}
                // onChange={(e) => setIsPublic(e.target.value)}
                onClick={() => setIsPublic(false)}
              />
              비공개
            </label>
          </div>
        </ScheduleItem>
        <ScheduleItem icon={<IoMap color="#589BF7" size={20} />} title="코스 등록" id="map"></ScheduleItem>
      </ul>

      {!startDate && !endDate && (
        <section className="px-[26px] pb-[16px] text-primary font-bold opacity-60 ">
          날짜(여행 일정)를 먼저 선택해 주세요!
        </section>
      )}
      {startDate && endDate && (
        <>
          {schedulePerDay && schedulePerDay.length >= 1 && (
            <div className="w-full h-64 mb-5">
              <CourseMap data={schedulePerDay} />
            </div>
          )}

          <div className="overflow-scroll  scrollbar-hide">
            <DayButton startDate={startDate} dayCount={dayCalculation} dayTitle={setDayTitle} setIndex={setSelectDay} />
          </div>
          <p className="text-center text-[14px] font-bold mb-[30px]">{dayTitle}</p>

          <section className="px-[26px] pb-[16px]">
            <Button onClick={() => setAddPlan(true)}>장소 추가</Button>

            <Course
              schedules={schedulePerDay}
              selectDay={selectDay}
              handleAddPlaceImgClick={handleAddPlaceImgClick}
              handleAddScoreClick={handleAddScoreClick}
              handleRemoveSingleScheduleClick={handleRemoveSingleScheduleClick}
            />
          </section>
        </>
      )}
      {/* 필터 */}
      <ScheduleItem icon={<IoPricetag color="#589BF7" size={20} />} title="태그" id="tag"></ScheduleItem>

      <section className="px-[26px] pb-[16px]">
        <Button onClick={() => setAddTag(true)}>태그 선택하기</Button>
        <div className="mb-7 mt-4">
          {tag && tag?.length !== 0 ? (
            <Tag tags={tag} />
          ) : (
            <span className="text-primary font-bold opacity-60 ">태그를 선택해주세요!</span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button type={'secondary'} onClick={onTempSave}>
            임시저장
          </Button>
          <Button type={'primary'} onClick={onSubmit}>
            작성완료
          </Button>
        </div>
      </section>
    </>
  );
}

function ScheduleItem({ icon, title, id, width, children, onClick }) {
  const getWidth = width ? width : 'w-[40%]';

  return (
    <li
      className="border-[#E8E8E8] border-b-[1px] px-[26px] py-[16px] flex items-center justify-between last:border-b-0"
      onClick={onClick}
    >
      <label htmlFor={id} className={`flex items-center gap-[10px] ${getWidth}`}>
        {icon}
        <strong className="text-[12px] font-semibold">{title}</strong>
      </label>
      <div className="flex items-center w-full gap-[2px]">{children}</div>
    </li>
  );
}

ScheduleItem.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
  id: PropTypes.string.isRequired,
  width: PropTypes.string,
  children: PropTypes.element,
  onClick: PropTypes.func,
};
