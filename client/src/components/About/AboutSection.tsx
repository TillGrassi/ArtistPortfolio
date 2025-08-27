export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-warm-gray">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-deep-charcoal mb-6">
              About Till
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Till Graßmann is a landscape painter with a deep artistic
                connection that traces back to his childhood. Influenced by his
                grandmother, Margret Brink, he has made art a central part of
                his life. Since 2021, he has devoted himself intensively to
                painting, with a particular focus on landscapes.
              </p>
              <p>
                His work is marked by a strong sense of wanderlust and reflects
                his deep bond with nature. Over the years, Till Graßmann has
                continuously developed his style, leading to a neo-impressionist
                approach in his most recent works.
              </p>
              <p>
                With expressive brushstrokes and vibrant colors, he captures not
                only the physical landscape but also the emotional essence of
                the scenes he portrays. Each of his paintings represents another
                chapter in his ongoing artistic journey.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>Germany</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-palette mr-2"></i>
                <span>Landscape & Neo-Impressionist</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-calendar mr-2"></i>
                <span>Active since 2021</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <img
              src="assets/Me.JPG"
              alt="Till Grassmann"
              className="w-full h-96 md:h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
