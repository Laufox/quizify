import PageTransition from '../components/PageTransition'

const AboutPage = () => {
    return (
        <PageTransition>
            <h1>About website</h1>

            <p>
                This website is the results of an examiniation project done over december/january of 2022/2023. The project had a timeline of one week of preparation and four week of executing the actual project. The content and features of this webside reflects the goals set during the preparation week.
            </p>

            <p>
                The Quizify project is built with ReactJS framework, using TypeScript as primary language combined with HTML as markup and SASS/CSS for styling porpuses. The project uses a few libraries imported through npm, such as React-Hook-Form and Classnames, but all markup and styling is self-written.
            </p>

            <p>
                To read and handle data, this project uses the Firebase services of Firestore, Authentication and Storage. All authentication methods and credential - handling is therefore under the responsibility of firebase Authentication, and not something that this website handles itself. The Quizify project also uses Firebase Hosting to hold the online version of this project.
            </p>

            <h2>Various external links related to this project</h2>
            <div className="link-collection">
                <a href="https://github.com/Laufox/quizify" target='_blank'>GitHub repo for source code</a>
                <a href="https://reactjs.org/" target='_blank'>Read more about ReactJS</a>
                <a href="https://firebase.google.com/" target='_blank'>Read more about Firebase</a>
            </div>
        </PageTransition>
    )
}

export default AboutPage