// Decoration for headings
export default function decorate() {
    document.addEventListener('DOMContentLoaded', () => {
        const heading = document.querySelector('.title');
        const text = heading.innerText;
        const letters = text.split('');
      
        const colors = ['red', 'green', 'blue', 'orange', 'purple', 'pink'];
      
        const coloredText = letters.map((letter, index) => {
            const span = document.createElement('span');
            span.style.color = colors[index % colors.length];
            span.innerText = letter;
            return span;
        })

        let currentIndex = 0;
        let intervalId = null;

        function strobeEffect() {
            intervalId = setInterval(() => {
                const spans = heading.querySelectorAll('span');
                spans.forEach((span) => {
                    span.style.opacity = '0.8';
                });

                const currentSpan = spans[currentIndex % spans.length];
                currentSpan.style.opacity = '1';

                currentIndex++;
            }, 1000)
        }
      
        heading.innerHTML = '';
        coloredText.forEach((span) => {
            heading.appendChild(span);
            
        })
        strobeEffect();
    })
}