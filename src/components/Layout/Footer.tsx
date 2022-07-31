import React from 'react'

import TwitterIcon from '@/icons/twitter.svg'
import Container from './Container'

const Footer = () => {
  return (
    <footer className="py-4">
      <Container>
        <div className="w-full md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <a
                href="https://twitter.com/_cryvia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="Twitter"
              >
                <TwitterIcon className="text-3xl" />
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-text-secondary mr-4">
            Made by{' '}
            <a
              className="text-primary hover:underline"
              href="https://twitter.com/mattiapomelli"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mattia Pomelli
            </a>{' '}
            and{' '}
            <a
              className="text-primary hover:underline"
              href="https://twitter.com/valdozzz1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edvaldo Gjonikaj
            </a>
            . All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
