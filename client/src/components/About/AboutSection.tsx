export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-warm-gray">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-deep-charcoal mb-6">
              About Elena
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Elena Rodriguez is a contemporary artist whose work explores the complex relationship between 
                urban environments and human emotion. Born in Barcelona and now based in Berlin, her paintings 
                capture the essence of modern life through bold strokes and carefully chosen color palettes.
              </p>
              <p>
                With over a decade of experience, Elena's work has been featured in galleries across Europe 
                and North America. Her unique approach combines classical oil painting techniques with 
                contemporary themes, creating pieces that resonate with viewers on both intellectual and 
                emotional levels.
              </p>
              <p>
                "I believe art should be a conversation between the observer and the observed, a moment 
                where time stops and understanding transcends words."
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>Berlin, Germany</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-palette mr-2"></i>
                <span>Oil & Mixed Media</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fas fa-calendar mr-2"></i>
                <span>Active since 2012</span>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=700"
              alt="Elena Rodriguez artist portrait in studio"
              className="w-full h-96 md:h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
