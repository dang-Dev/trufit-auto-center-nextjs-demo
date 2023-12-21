export default function FindUs() {
    return (
        <section className="container mx-auto pl-[2%] pr-[2%]">
            <h1 className="text-center text-lg lg:text-4xl underline underline-offset-8 text-red-500 font-semibold font-sans mb-7">
                FIND US
            </h1>
            <div className="overflow-hidden">
                <div id="embed-map-canvas" className="w-full h-[600px]">
                    <iframe
                        className="border-0 w-full h-full"
                        src="https://www.google.com/maps/embed/v1/place?q=Trufit+Auto+Center,+Vinzons+Avenue,+Daet,+Camarines+Norte,+Philippines&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
// <style>#embed-map-canvas .text-marker{}.map-generator{max-width: 100%; max-height: 100%; background: none;</style>
