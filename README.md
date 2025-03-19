# Event Crisis

A chatbot-based event planning game built with NestJS, implementing CQRS pattern and domain-driven design principles.

## Overview

Event Crisis is a strategic game where players must manage their budget while planning an event and dealing with unexpected issues. Players select various components for their event such as venues, entertainment, and catering, while working within a budget and responding to surprise challenges.

## Architecture

This project follows a clear domain-driven design approach with a CQRS (Command Query Responsibility Segregation) pattern. The codebase is organized into modules with a clear separation of concerns:

- **Domain Layer**: Contains business entities, logic, and interfaces
- **Application Layer**: Implements commands and queries
- **Infrastructure Layer**: Contains repository implementations
- **Presentation Layer**: Interfaces with external clients

### Key Design Patterns

- **CQRS**: Separation of commands (write operations) and queries (read operations)
- **Repository Pattern**: Abstraction over data storage
- **Builder Pattern**: Used to create test fixtures
- **Domain Events**: For cross-boundary communication

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- PostgreSQL (for production deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/MonsieurBarti/event-crisis.git
cd event-crisis

# Install dependencies
yarn install

# Generate Prisma client
yarn prisma:generate

# For development with database
yarn prisma:migrate
yarn prisma:seed

# Run tests
yarn test

# Start the development server
yarn start:dev
```

## Testing

The application includes extensive tests using Jest:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:cov

# Run tests in watch mode
yarn test:watch

# Run e2e tests
yarn test:e2e
```

### Testing Philosophy

- Each command and query has its own test suite
- Tests use builders rather than mocks
- In-memory repositories are used for testing
- @faker-js/faker is used to generate random test data

## Project Structure

```
src/
  └── modules/
      ├── game/                  # Game module
      │   ├── application/       # Commands and queries
      │   │   ├── commands/      # Command handlers
      │   │   └── queries/       # Query handlers
      │   ├── domain/            # Domain models and interfaces
      │   │   ├── game/          # Game entity and repository interface
      │   │   └── ...            # Other domain entities
      │   ├── infrastructure/    # Implementation details
      │   │   └── persistence/   # Repository implementations
      │   └── presentation/      # Controllers and DTOs
      └── shared/                # Shared functionality
          └── database/          # Database configuration
              └── prisma/        # Prisma schema and migrations
```

## Game Mechanics

- Players manage a budget for event planning
- Selections include: Brief, Venue, Concept, Entertainment, Catering, Constraint
- Unexpected issues arise that impact budget
- Final scoring depends on strategy and budget efficiency
- Error handling prevents invalid selections

## Error Handling

The game implements robust error handling:

- Budget validation (InsufficientBudgetError)
- Entity existence validation (NotFoundError)
- Prerequisite validation (PrerequisiteError)
- Game state validation (GameError)

## License

ISC
