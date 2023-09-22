import HomeLayout from "../Layouts/HomeLayout";
import aboutMainImage from "../Assets/Images/aboutmainImage.png";
import { celebrities } from "../Constants/Constant";
import CarouselSlide from "../Component/CarouselSlide";

function AboutUs() {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y10">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <br />
            <p className="text-xl text-gray-200">
              Our goal is to provide the Affordable and quality education to
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower in growth and contribute in wellness of mankind.
            </p>
          </section>

          <div className="w-1/2">
            <img
              src={aboutMainImage}
              id="test1"
              className="drop-shadow-2xl"
              style={{ filter: "drope-shadow(0px 10px 10px rgb(0,0,0))" }}
              alt="about main image"
            />
          </div>
        </div>
      </div>

      <div className="carousel w-1/2 my-16 m-auto">
        <CarouselSlide />
        {celebrities && celebrities.map(e => (<CarouselSlide {...e} key={e.slideNumber} totalSlides={5}/>))}
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
