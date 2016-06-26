;(function() {
  var React;
  var ReactDOM;
  if (typeof require !== 'undefined') {
    React = require('react');
    ReactDOM = require('react-dom');
  } else if (typeof window !== 'undefined') {
    React = window.React;
    ReactDOM = window.ReactDOM;
  }

  var RETURN_KEY = 13;

  function NestedLink() {
    React.Component.apply(this, arguments);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  NestedLink.propTypes = {
    tag: React.PropTypes.node.isRequired,
    role: React.PropTypes.string.isRequired,
    href: React.PropTypes.string.isRequired,
    className: React.PropTypes.string.isRequired,
    tabIndex: React.PropTypes.number.isRequired,
    onFocus: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    onMouseEnter: React.PropTypes.func.isRequired,
    onMouseLeave: React.PropTypes.func.isRequired,
    onKeyPress: React.PropTypes.func.isRequired,
  };

  NestedLink.defaultProps = {
    tag: 'span',
    role: 'link',
    href: '',
    className: '',
    tabIndex: 0,
    onFocus: function() {},
    onBlur: function() {},
    onMouseEnter: function() {},
    onMouseLeave: function() {},
    onKeyPress: function() {},
  };

  NestedLink.prototype = Object.assign(Object.create(React.Component.prototype), {
    componentDidMount: function() {
      this.domNode = ReactDOM.findDOMNode(this);

      var parentLink = this.domNode.parentNode;
      while (parentLink.nodeName !== 'A' && parentLink !== document) {
        parentLink = parentLink.parentNode;
      }

      if (parentLink === document) {
        throw new Error('Nested links must descend from real links. See ' + this.domNode.outerHTML);
      }

      this.parentLink = parentLink;
      this.originalHref = this.parentLink.getAttribute('href');
    },

    handleFocus: function(event) {
      if (event.target === this.domNode) {
        this.parentLink.setAttribute('href', this.props.href);
        this.parentLink.dataset.focusedHref = this.props.href;
      }

      this.props.onFocus.apply(null, arguments);
    },

    handleBlur: function() {
      this.parentLink.setAttribute('href', this.originalHref);
      delete this.parentLink.dataset.focusedHref;

      this.props.onBlur.apply(null, arguments);
    },

    handleEnter: function() {
      this.parentLink.setAttribute('href', this.props.href);

      this.props.onMouseEnter.apply(null, arguments);
    },

    handleLeave: function() {
      var resetHref = this.originalHref;
      if (this.parentLink.dataset.focusedHref !== undefined) {
        resetHref = this.parentLink.dataset.focusedHref;
      }
      this.parentLink.setAttribute('href', resetHref);

      this.props.onMouseLeave.apply(null, arguments);
    },

    handleKeyPress: function(event) {
      this.props.onKeyPress.apply(null, arguments);

      if (!event.isDefaultPrevented() && event.which === RETURN_KEY) {
        this.parentLink.click();
      }
    },

    render: function() {
      return React.createElement(this.props.tag, Object.assign({}, this.props, {
        className: ['nested-link', this.props.className].filter(Boolean).join(' '),
        onFocus: this.handleFocus,
        onBlur: this.handleBlur,
        onMouseEnter: this.handleEnter,
        onMouseLeave: this.handleLeave,
        onKeyPress: this.handleKeyPress,
      }), this.props.children);
    },
  });

  if (typeof module !== 'undefined') {
    module.exports = NestedLink;
  } else if (typeof window !== 'undefined') {
    window.ReactNestedLink = NestedLink;
  }
}());
