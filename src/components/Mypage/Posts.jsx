import { IoAdd } from 'react-icons/io5';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { IoLockClosedOutline } from 'react-icons/io5';
import sample from '../../assets/images/sample.jpg';
import { Link } from 'react-router-dom';

export default function Posts() {
  return (
    <>
      <div className="bg-gray-4 py-[13px] px-[16px] rounded-[4px] flex gap-[10px] items-center mb-[24px] cursor-pointer">
        <button className="w-[36px] h-[36px] bg-primary rounded-full flex items-center justify-center">
          <IoAdd className="text-white" size={23} />
        </button>
        <Link to="/schedule" className="w-[80%]">
          <strong className="text-black text-[12px]">여행 일정 만들기</strong>
          <span className="block text-gray-1 text-[10px]">새로운 여행을 떠나보세요.</span>
        </Link>
      </div>
      {/* Mypage Inner Title Compoenent */}
      <div className="text-center mb-[20px]">
        <div className="flex items-center justify-center gap-[4px]">
          <strong className="text-black text-[14px]">지난 여행</strong>
        </div>
        <span className="block text-gray-1 text-[12px]">총 3건</span>
      </div>
      {/* Mypage Inner Title Compoenent */}

      <div className="flex flex-col gap-[20px]">
        {/* Post List Component */}
        <div className="flex gap-[16px] items-center">
          <img src={sample} alt="card-thumbnail" className="w-[60px] h-[60px] rounded-full object-cover" />
          <div className="w-[65%]">
            <div className="flex items-center">
              <strong className=" block text-black text-[14px] truncate">제목제목제목제목제목제목제목제목제목</strong>
              <IoLockClosedOutline size={15} />
            </div>
            <span className="text-gray-1 text-[14px] font-medium">2023.05.24 ~ 05.28</span>
          </div>
          <IoEllipsisHorizontalSharp size={25} />
        </div>
        {/* Post List Component */}
        <div className="flex gap-[16px] items-center">
          <img src={sample} alt="card-thumbnail" className="w-[60px] h-[60px] rounded-full object-cover" />
          <div className="w-[65%]">
            <div className="flex items-center">
              <strong className=" block text-black text-[14px] truncate">제목제목제목제목제목제목제목제목제목</strong>
              <IoLockClosedOutline size={15} />
            </div>
            <span className="text-gray-1 text-[14px]">2023.05.24 ~ 05.28</span>
          </div>
          <IoEllipsisHorizontalSharp size={25} />
        </div>
        <div className="flex gap-[16px] items-center">
          <img src={sample} alt="card-thumbnail" className="w-[60px] h-[60px] rounded-full object-cover" />
          <div className="w-[65%]">
            <div className="flex items-center">
              <strong className=" block text-black text-[14px] truncate">제목제목제목제목제목제목제목제목제목</strong>
              <IoLockClosedOutline size={15} />
            </div>
            <span className="text-gray-1 text-[14px]">2023.05.24 ~ 05.28</span>
          </div>
          <IoEllipsisHorizontalSharp size={25} />
        </div>
        <div className="flex gap-[16px] items-center">
          <img src={sample} alt="card-thumbnail" className="w-[60px] h-[60px] rounded-full object-cover" />
          <div className="w-[65%]">
            <div className="flex items-center">
              <strong className=" block text-black text-[14px] truncate">제목제목제목제목제목제목제목제목제목</strong>
              <IoLockClosedOutline size={15} />
            </div>
            <span className="text-gray-1 text-[14px]">2023.05.24 ~ 05.28</span>
          </div>
          <IoEllipsisHorizontalSharp size={25} />
        </div>
        {/* Post List Component */}
      </div>
    </>
  );
}
