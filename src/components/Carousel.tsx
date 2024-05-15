import React  from 'react'

interface CarouseProps {
  src: string,
  style?: object,
  className?: string
}

const Carousel:React.FC<CarouseProps> = (props) => {
    const { src, style, className } = props;
    return (
      <div style={style} className={className}>
        <img
          src={src}
          className='w-[100%] h-[100%]'
          style={{ width: '100%', objectFit: 'cover' }}
          alt='Banner'
        />
      </div>
    );
  }

export default Carousel;